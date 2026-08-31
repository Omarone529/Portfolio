import Foundation
import Vision
import CoreImage
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import AppKit

// Builds the hero images, following the construction used on
// adhamdannaway.com.
//
// His hero is not two half faces: it is the SAME composition rendered twice at
// full width, once photographic and once painted, layered so that two sliding
// windows decide how much of each is visible. The seam is wherever the windows
// meet, which is why it can travel across the face as the pointer moves. This
// tool produces that pair.
//
// Both images share one crop, one size and one alignment, so the seam works at
// any position. The painted treatment runs over the whole figure. His stops at
// the neck and lets the t-shirt stay photographic on both sides, which works
// because the shirt is white and reads as nothing; a dark shirt filling half
// the frame does not, and left alone it makes the painted half look like a
// photograph with a small drawing on top of it.
//
// The subject is isolated with Vision's per-instance person segmentation, so
// anyone standing behind him is dropped and the background stays transparent.
//
// The compositing is done over raw pixels rather than with CIBlendWithMask.
// Vision's per-instance mask is a one-component buffer, and the blend filter
// does not read it the way its documentation describes: fed the mask as-is it
// keeps the whole frame, fed the same values moved into alpha it keeps nothing.
// Doing the arithmetic here leaves no filter semantics to guess at.
//
// usage: hero <input> <outPrefix> <instance> <faceX> <cropY> <cropW> <cropH> <neckY> <outW>
//
//   faceX   x of the nose in the original: the composition is centred on it
//   cropY   first row of the crop
//   cropW   crop width, which must be in 840:600 proportion with cropH
//   cropH   crop height
//   neckY   source row where the head ends: above it the hair is filled solid
//           and the paint is laid dense, below it neither happens
//   outW    output width in pixels
//
// writes <outPrefix>-photo.png, <outPrefix>-paint.png, <outPrefix>-face.png
// and <outPrefix>-strokes.png

let args = CommandLine.arguments
guard args.count >= 10,
      let instance = Int(args[3]),
      let faceX = Int(args[4]),
      let cropY = Int(args[5]),
      let cropW = Int(args[6]),
      let cropH = Int(args[7]),
      let neckY = Int(args[8]),
      let outW = Int(args[9])
else {
    FileHandle.standardError.write(
        ("usage: hero <input> <outPrefix> <instance> <faceX> <cropY> <cropW>"
         + " <cropH> <neckY> <outW>\n").data(using: .utf8)!)
    exit(2)
}

let inputURL = URL(fileURLWithPath: args[1])
let prefix = args[2]

guard let source = CIImage(contentsOf: inputURL) else {
    FileHandle.standardError.write("cannot read \(inputURL.path)\n".data(using: .utf8)!)
    exit(1)
}

let context = CIContext()
let handler = VNImageRequestHandler(ciImage: source, options: [:])
let request = VNGeneratePersonInstanceMaskRequest()
try handler.perform([request])

guard let observation = request.results?.first else {
    FileHandle.standardError.write("no people found\n".data(using: .utf8)!)
    exit(1)
}

let width = Int(source.extent.width)
let height = Int(source.extent.height)
let rgb = CGColorSpaceCreateDeviceRGB()

/// Renders a CIImage to a top-down RGBA8 buffer the size of the source.
func rasterize(_ image: CIImage) -> [UInt8] {
    var pixels = [UInt8](repeating: 0, count: width * height * 4)
    context.render(
        image,
        toBitmap: &pixels,
        rowBytes: width * 4,
        bounds: CGRect(x: 0, y: 0, width: width, height: height),
        format: .RGBA8,
        colorSpace: rgb
    )
    return pixels
}

let photo = rasterize(source)

let maskBuffer = try observation.generateScaledMaskForImage(
    forInstances: IndexSet(integer: instance),
    from: handler
)
let maskPixels = rasterize(CIImage(cvPixelBuffer: maskBuffer))

/// The mask trails off softly over the people standing behind, which leaves
/// them as a ghost at low alpha. A smoothstep across the middle of the range
/// clears that while keeping the silhouette edge antialiased.
func maskAt(_ i: Int) -> Double {
    let raw = Double(maskPixels[i]) / 255
    let t = min(1, max(0, (raw - 0.40) / 0.25))
    return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------------------
// Noise
// ---------------------------------------------------------------------------

/// Hash of a lattice point, repeatable.
func hash(_ x: Int, _ y: Int, _ seed: Int) -> Double {
    var h = UInt64(bitPattern: Int64(
        x &* 374_761_393 &+ y &* 668_265_263 &+ seed &* 2_147_483_647))
    h = (h ^ (h >> 13)) &* 1_274_126_177
    h = h ^ (h >> 16)
    return Double(h % 4096) / 4096
}

/// Smooth value noise over an arbitrary lattice, bilinear between points.
func noiseAt(_ fx: Double, _ fy: Double, seed: Int) -> Double {
    let x0 = Int(fx.rounded(.down))
    let y0 = Int(fy.rounded(.down))
    let tx = fx - Double(x0)
    let ty = fy - Double(y0)
    let sx = tx * tx * (3 - 2 * tx)
    let sy = ty * ty * (3 - 2 * ty)

    let top = hash(x0, y0, seed) * (1 - sx) + hash(x0 + 1, y0, seed) * sx
    let bottom = hash(x0, y0 + 1, seed) * (1 - sx) + hash(x0 + 1, y0 + 1, seed) * sx
    return top * (1 - sy) + bottom * sy
}

/// Smooth noise sampled through a rotation and a strong anisotropy, so the
/// field comes out as long streaks running at `angle`.
///
/// This is what makes the colour read as brush strokes: a round noise field
/// thresholded gives blobs, the same field stretched 10:1 along one direction
/// gives strokes with brushy, broken ends.
///
/// - Parameters:
///   - x: pixel column
///   - y: pixel row
///   - angle: stroke direction, in radians
///   - along: lattice spacing along the stroke, large for long strokes
///   - across: lattice spacing across it, small for narrow strokes
///   - seed: which field to sample
/// - Returns: a value in 0..<1
func streak(
    _ x: Int, _ y: Int, angle: Double, along: Double, across: Double, seed: Int
) -> Double {
    let c = cos(angle), s = sin(angle)
    let u = (Double(x) * c + Double(y) * s) / along
    let v = (-Double(x) * s + Double(y) * c) / across
    return noiseAt(u, v, seed: seed)
}

/// Hermite ramp between two edges.
func smoothstep(_ edge0: Double, _ edge1: Double, _ x: Double) -> Double {
    let t = min(1, max(0, (x - edge0) / (edge1 - edge0)))
    return t * t * (3 - 2 * t)
}

/// Deterministic RNG, so every rerun lays the same strokes.
var rngState: UInt64 = 0x9E37_79B9_7F4A_7C15

func rand() -> Double {
    rngState = rngState &* 6_364_136_223_846_793_005 &+ 1_442_695_040_888_963_407
    return Double((rngState >> 33) % 1_048_576) / 1_048_576
}

func randIn(_ lo: Double, _ hi: Double) -> Double { lo + (hi - lo) * rand() }

// ---------------------------------------------------------------------------
// Colour
// ---------------------------------------------------------------------------

typealias Colour = (r: Double, g: Double, b: Double)

/// The ink the features are drawn in.
let INK: Colour = (0.07, 0.07, 0.08)

/// Sampled from the reference's painted half: mustard, teal, coral and a pale
/// salmon over white paper, with red as an accent. The list is weighted rather
/// than uniform, because red used as often as the rest turns the whole half
/// into one warm mass.
let PAINT: [Colour] = [
    (0.94, 0.73, 0.24), // mustard
    (0.55, 0.78, 0.78), // teal
    (0.94, 0.63, 0.55), // coral
    (0.95, 0.75, 0.71), // pale salmon
    (0.94, 0.73, 0.24), // mustard
    (0.55, 0.78, 0.78), // teal
    (0.94, 0.63, 0.55), // coral
    (0.90, 0.27, 0.23), // red, one in eight
]

// ---------------------------------------------------------------------------
// Luminance, blurred, and its edges
// ---------------------------------------------------------------------------

/// Luminance of one source pixel, by index.
func luminance(_ i: Int) -> Double {
    0.299 * Double(photo[i * 4]) / 255
        + 0.587 * Double(photo[i * 4 + 1]) / 255
        + 0.114 * Double(photo[i * 4 + 2]) / 255
}

/// Box maximum or minimum over a square, separably: dilation and erosion.
func morphed(_ input: [Double], radius: Int, dilate: Bool) -> [Double] {
    func pick(_ a: Double, _ b: Double) -> Double { dilate ? max(a, b) : min(a, b) }

    var pass = input
    for y in 0..<height {
        for x in 0..<width {
            var v = input[y * width + x]
            for k in -radius...radius {
                v = pick(v, input[y * width + min(width - 1, max(0, x + k))])
            }
            pass[y * width + x] = v
        }
    }

    var out = pass
    for x in 0..<width {
        for y in 0..<height {
            var v = pass[y * width + x]
            for k in -radius...radius {
                v = pick(v, pass[min(height - 1, max(0, y + k)) * width + x])
            }
            out[y * width + x] = v
        }
    }

    return out
}

/// Box blur, twice, which is close enough to a Gaussian and separable.
func blurred(_ input: [Double], radius: Int) -> [Double] {
    var values = input

    for _ in 0..<2 {
        var pass = values

        for y in 0..<height {
            var sum = 0.0
            for x in -radius...radius {
                sum += values[y * width + min(width - 1, max(0, x))]
            }
            let span = Double(radius * 2 + 1)
            for x in 0..<width {
                pass[y * width + x] = sum / span
                let out = min(width - 1, max(0, x - radius))
                let into = min(width - 1, max(0, x + radius + 1))
                sum += values[y * width + into] - values[y * width + out]
            }
        }

        values = pass
        pass = values

        for x in 0..<width {
            var sum = 0.0
            for y in -radius...radius {
                sum += values[min(height - 1, max(0, y)) * width + x]
            }
            let span = Double(radius * 2 + 1)
            for y in 0..<height {
                pass[y * width + x] = sum / span
                let out = min(height - 1, max(0, y - radius))
                let into = min(height - 1, max(0, y + radius + 1))
                sum += values[into * width + x] - values[out * width + x]
            }
        }

        values = pass
    }

    return values
}

/// Posterising the photograph as it comes gives dithered noise, because the
/// grain crosses every threshold pixel by pixel. Blurring first is what gives
/// the painted side its flat, brushed areas.
let smooth = blurred(
    (0..<(width * height)).map { luminance($0) },
    radius: 3
)

/// The same luminance blurred until nothing of the subject is left in it, so
/// that subtracting it leaves only the modelling.
///
/// Paint has to go where the form turns away from the light, not where the
/// photograph happens to be dark. The reference never had to make the
/// distinction: his face is mid grey and his t-shirt is white, so absolute
/// tone and modelling say the same thing. Here the face is the brightest thing
/// in the frame and the shirt is nearly black, and an absolute threshold puts
/// every stroke on the shirt and leaves the face bare paper.
let ambient = blurred(smooth, radius: 48)

/// Gradient magnitude of the blurred luminance, by Sobel.
func edgeStrength() -> [Double] {
    var edges = [Double](repeating: 0, count: width * height)
    for y in 1..<(height - 1) {
        for x in 1..<(width - 1) {
            let i = y * width + x
            let gx =
                -smooth[i - width - 1] - 2 * smooth[i - 1] - smooth[i + width - 1]
                + smooth[i - width + 1] + 2 * smooth[i + 1] + smooth[i + width + 1]
            let gy =
                -smooth[i - width - 1] - 2 * smooth[i - width] - smooth[i - width + 1]
                + smooth[i + width - 1] + 2 * smooth[i + width] + smooth[i + width + 1]
            edges[i] = (gx * gx + gy * gy).squareRoot()
        }
    }
    return edges
}

let edges = edgeStrength()

// ---------------------------------------------------------------------------
// The ink shapes
// ---------------------------------------------------------------------------

// The reference draws nothing with a line. Look at his illustrated half at
// magnification and there is not one contour anywhere: the hair is a single
// solid mass with spikes torn out of its edge, the eyebrow is a fat black
// comma, the eye is a filled crescent, the nostril and the mouth are blots.
// The face has no outline at all, and the cheek is left as bare paper. What
// makes it read as a face is the weight and placement of five or six solid
// shapes; the colour behind them is atmosphere.
//
// So these are shapes, not strokes. Thresholding the tones finds the hair and
// the pupils; the rest are filled from Vision's landmarks, because a brow at
// 0.44 and a cheek at 0.54 are too close for any threshold to separate.
//
// Coverage per pixel, 0 to 1, before the edge is torn.
var ink = [Double](repeating: 0, count: width * height)

/// Lays a disc of ink.
func stamp(_ px: Double, _ py: Double, radius: Double) {
    let x0 = max(0, Int(px - radius) - 1)
    let x1 = min(width - 1, Int(px + radius) + 1)
    let y0 = max(0, Int(py - radius) - 1)
    let y1 = min(height - 1, Int(py + radius) + 1)
    guard x0 <= x1, y0 <= y1 else { return }

    for y in y0...y1 {
        for x in x0...x1 {
            let dx = Double(x) - px, dy = Double(y) - py
            if dx * dx + dy * dy <= radius * radius { ink[y * width + x] = 1 }
        }
    }
}

/// Walks a Catmull-Rom spline through the points, laying ink as it goes.
///
/// Vision returns a brow as six points and a mouth as fourteen. Joined with
/// straight segments they read as a polygon, which is the one thing a brush
/// never looks like, so the curve is interpolated through them instead.
///
/// - Parameters:
///   - points: the landmark points, top-down, in source pixels
///   - closed: whether the last point joins the first, as a mouth does
///   - thickness: width of the shape in pixels, at its fattest
///   - taper: how much thinner the two ends are than the middle
func inkCurve(_ points: [CGPoint], closed: Bool, thickness: Double, taper: Double = 0) {
    guard points.count >= 2 else { return }
    let n = points.count

    func at(_ k: Int) -> CGPoint {
        closed ? points[((k % n) + n) % n] : points[min(n - 1, max(0, k))]
    }

    let segments = closed ? n : n - 1
    for i in 0..<segments {
        let p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2)
        let span = Double(hypot(p2.x - p1.x, p2.y - p1.y))
        let steps = max(2, Int(span * 3))

        for step in 0...steps {
            let t = Double(step) / Double(steps)
            let t2 = t * t, t3 = t2 * t

            func axis(_ a: CGFloat, _ b: CGFloat, _ c: CGFloat, _ d: CGFloat) -> Double {
                0.5 * (2 * Double(b)
                    + (Double(c) - Double(a)) * t
                    + (2 * Double(a) - 5 * Double(b) + 4 * Double(c) - Double(d)) * t2
                    + (-Double(a) + 3 * Double(b) - 3 * Double(c) + Double(d)) * t3)
            }

            let x = axis(p0.x, p1.x, p2.x, p3.x)
            let y = axis(p0.y, p1.y, p2.y, p3.y)

            // A brush bears down in the middle of a mark and lifts at its ends.
            let along = (Double(i) + t) / Double(segments)
            let weight = closed ? 1 : 1 - taper * (1 - sin(along * Double.pi))
            stamp(x, y, radius: thickness * 0.5 * weight)
        }
    }
}

/// Fills a closed landmark region, by scanline.
func inkRegion(_ points: [CGPoint]) {
    guard points.count >= 3 else { return }
    let top = max(0, Int(points.map(\.y).min()!))
    let bottom = min(height - 1, Int(points.map(\.y).max()!))
    guard top <= bottom else { return }

    for y in top...bottom {
        let scan = Double(y) + 0.5
        var crossings: [Double] = []

        for i in 0..<points.count {
            let a = points[i], b = points[(i + 1) % points.count]
            let ay = Double(a.y), by = Double(b.y)
            guard (ay <= scan && by > scan) || (by <= scan && ay > scan) else { continue }
            crossings.append(Double(a.x) + (scan - ay) / (by - ay) * (Double(b.x) - Double(a.x)))
        }

        crossings.sort()
        var i = 0
        while i + 1 < crossings.count {
            let x0 = max(0, Int(crossings[i].rounded()))
            let x1 = min(width - 1, Int(crossings[i + 1].rounded()))
            if x0 <= x1 {
                for x in x0...x1 { ink[y * width + x] = 1 }
            }
            i += 2
        }
    }
}

/// Pulls a closed region in towards its own centre.
///
/// - Parameters:
///   - points: the region, in source pixels
///   - by: 1 leaves it alone, 0.7 keeps seven tenths of its width
func contracted(_ points: [CGPoint], by: Double) -> [CGPoint] {
    guard !points.isEmpty else { return points }
    let n = CGFloat(points.count)
    let cx = points.map(\.x).reduce(0, +) / n
    let cy = points.map(\.y).reduce(0, +) / n
    return points.map {
        CGPoint(x: cx + ($0.x - cx) * CGFloat(by), y: cy + ($0.y - cy) * CGFloat(by))
    }
}

/// The face the composition is centred on: the one whose box sits nearest the
/// nose the caller named, so a crowd cannot hand back the wrong landmarks.
func faceNearest(_ x: Int) -> VNFaceObservation? {
    let request = VNDetectFaceLandmarksRequest()
    try? handler.perform([request])
    return (request.results ?? []).min {
        abs($0.boundingBox.midX * Double(width) - Double(x))
            < abs($1.boundingBox.midX * Double(width) - Double(x))
    }
}

/// The features, as the reference draws them: a fat comma for each brow, a
/// filled crescent for each eye, a blot at the nostrils, a solid mouth.
///
/// Weights are fractions of the face's own width, so the same numbers hold
/// whatever the photograph's resolution. They are deliberately heavy. A brow
/// at the width a brow really is disappears once the whole thing is torn at
/// the edges and dropped to a third of its size on the page.
func drawFeatures(_ face: VNFaceObservation) {
    guard let marks = face.landmarks else { return }
    let size = CGSize(width: width, height: height)
    let span = face.boundingBox.width * Double(width)

    // Vision hands back points with a bottom-left origin; everything here is
    // top-down.
    func points(_ region: VNFaceLandmarkRegion2D?) -> [CGPoint] {
        (region?.pointsInImage(imageSize: size) ?? []).map {
            CGPoint(x: $0.x, y: CGFloat(height) - $0.y)
        }
    }

    inkCurve(points(marks.leftEyebrow), closed: false, thickness: span * 0.055, taper: 0.75)
    inkCurve(points(marks.rightEyebrow), closed: false, thickness: span * 0.055, taper: 0.75)

    // Filled, then fattened by running the rim as well: Vision traces the lash
    // line tightly and the reference's eye is heavier than that.
    for eye in [points(marks.leftEye), points(marks.rightEye)] {
        inkRegion(eye)
        inkCurve(eye, closed: true, thickness: span * 0.014)
    }

    // Pulled in towards its own middle before filling. Vision traces the outer
    // edge of the lip, and a mouth filled out to there is a blot the size of
    // the chin: on this photograph, where the mouth is pushed forward, it
    // reads as a hole in the face.
    inkRegion(contracted(points(marks.outerLips), by: 0.7))

    // The nose is the one feature the reference does not draw whole: a blot
    // where the nostril is and nothing along the bridge. Vision's nose region
    // runs from one nostril round the tip to the other, so its lower half is
    // exactly that blot, laid as a comma rather than a line.
    let nose = points(marks.nose)
    if nose.count >= 4 {
        let low = nose.sorted { $0.y > $1.y }.prefix(max(3, nose.count / 2))
        inkCurve(Array(low), closed: false, thickness: span * 0.075, taper: 0.85)
    }
}

/// The hair, as one mass.
///
/// Thresholding gives a spray of separate curls with daylight between them,
/// and at the size this ends up on the page that reads as noise. The reference
/// has one solid shape with spikes torn off its outside, so the curls are
/// closed into each other: dilate to join them, erode by the same amount to
/// put the outline back where it was. The spikes survive because closing only
/// fills what is enclosed.
///
/// - Parameter until: the row the head ends at. The shirt is darker than the
///   hair and would otherwise come through as a second mass.
func drawHair(until: Int) {
    var hair = [Double](repeating: 0, count: width * height)
    for y in 0..<min(until, height) {
        for x in 0..<width {
            let i = y * width + x
            if maskAt(i * 4) > 0.5, luminance(i) < 0.28 { hair[i] = 1 }
        }
    }

    let joined = morphed(morphed(hair, radius: 5, dilate: true), radius: 5, dilate: false)
    for i in 0..<(width * height) where joined[i] > 0.5 { ink[i] = 1 }

    // Spikes. The mask ends where the head ends, so hair cut to it comes out
    // with the smooth rim of a cutout, and his goes off in points. Grown once
    // more and torn, the points come back without ever sampling the
    // background, which behind this head is a dark room and would arrive as
    // blots.
    //
    // Only past the silhouette. Grown in every direction the same dilation
    // walks down over the forehead as well, and a hairline is the one edge of
    // the hair that is supposed to be where the photograph put it.
    let grown = morphed(joined, radius: 5, dilate: true)
    for y in 0..<height {
        for x in 0..<width {
            let i = y * width + x
            guard grown[i] > 0.5, joined[i] <= 0.5, maskAt(i * 4) <= 0.5 else { continue }
            if streak(x, y, angle: -1.35, along: 26, across: 5, seed: 13) < 0.42 {
                ink[i] = 1
            }
        }
    }
}

drawHair(until: neckY)

let subject = faceNearest(faceX)
if let subject {
    drawFeatures(subject)
} else {
    FileHandle.standardError.write(
        "no face found near x \(faceX): the painted half will have no features\n"
            .data(using: .utf8)!)
}

/// The width of the face in source pixels, which is the unit every painted
/// mark is measured in: a stroke is a fraction of a face, not of an image.
let faceSpan = subject.map { $0.boundingBox.width * Double(width) }
    ?? Double(width) * 0.15

// Softened so the shapes have a ramp at their edge for the tearing to bite
// into. Against a hard 0 or 1 the noise below has nothing to work with and
// every shape keeps the smooth rim of the polygon it came from.
let inkField = blurred(ink, radius: 4)

// ---------------------------------------------------------------------------
// The paint
// ---------------------------------------------------------------------------

// Strokes, laid one at a time over the figure.
//
// The obvious way to do this is to threshold a stretched noise field, and it
// does not work. An anisotropic field covers the plane, so at any coverage
// worth having the marks join up end to end and the face comes out barred like
// a shutter. A brush stroke has two ends and a neighbour it does not touch.
//
// So they are drawn: a start, a direction, a length, a taper, and a grain
// eaten along the length by a dry brush. It is the same primitive the strokes
// block under the painted side is built from.

/// Where paint may fall: the silhouette, grown and then torn along the brush
/// direction.
///
/// Clipped to the mask exactly, every stroke that reaches the outline is cut
/// off along it. A straight shoulder then comes out as a straight razor cut
/// through the middle of a dozen brush marks, and everywhere else the clipped
/// ends leave a thin rim of colour hugging the edge, which reads as the
/// outline this style does not have. A painter runs over the edge instead.
let paintZone: [Double] = {
    let inside = (0..<(width * height)).map { maskAt($0 * 4) > 0.5 ? 1.0 : 0.0 }
    let near = morphed(inside, radius: 5, dilate: true)
    let mid = morphed(inside, radius: 10, dilate: true)
    let far = morphed(inside, radius: 16, dilate: true)

    var zone = [Double](repeating: 0, count: width * height)
    for y in 0..<height {
        for x in 0..<width {
            let i = y * width + x
            if inside[i] > 0.5 {
                zone[i] = 1
                continue
            }
            guard far[i] > 0.5 else { continue }

            // Thinning out with distance, so the overshoot is a fringe of torn
            // ends and not a halo the shape of the figure. The tear has to be
            // coarse: a fine one only serrates the cut, and a shoulder is a
            // long enough straight run that a serrated edge still reads as a
            // straight edge.
            let keep = near[i] > 0.5 ? 0.78 : (mid[i] > 0.5 ? 0.44 : 0.17)
            if streak(x, y, angle: -1.16, along: 45, across: 16, seed: 12) < keep {
                zone[i] = 1
            }
        }
    }
    return zone
}()

/// How much paint a point wants: more where the form turns away from the
/// light, less on the planes facing it.
///
/// The floor matters more than the range. Look at the reference again: his
/// cheek is not bare because it is lit, it is covered in strokes with paper
/// showing between them and through the grain inside them. Paint driven off
/// the tones alone leaves this face blank, both because it was lit flat and
/// because the ring of dark hair around it drags the local mean down until
/// every part of the skin counts as a highlight.
func wantsPaint(_ i: Int) -> Double {
    let modelled = smooth[i] - ambient[i] + 0.5
    let value = min(1, max(0, (modelled - 0.30) / 0.42))
    return 0.45 + 0.55 * smoothstep(0.9, 0.3, value)
}

var paintColour = [Colour](repeating: (0, 0, 0), count: width * height)
var paintAlpha = [Double](repeating: 0, count: width * height)

/// Scatters strokes over the silhouette.
///
/// - Parameters:
///   - count: how many to attempt; those starting off the figure are dropped,
///     so the figure's own shape sets the real number
///   - rows: the band of source rows a stroke may start in
///   - length: how long a stroke runs, in face widths
///   - half: half the width of a stroke at its fattest, in face widths
func layPaint(count: Int, rows: Range<Int>,
              length: ClosedRange<Double>, half: ClosedRange<Double>) {
    // Steep, and all within a narrow band of each other: his run one way.
    // Fanned any wider they stop reading as one hand at one sitting.
    for n in 0..<count {
        let startX = randIn(0, Double(width))
        let startY = randIn(Double(rows.lowerBound), Double(rows.upperBound))
        let origin = (Int(startY) * width + Int(startX)) * 4
        guard maskAt(origin) > 0.5 else { continue }

        let angle = randIn(-1.35, -0.85)
        let length = randIn(length.lowerBound, length.upperBound) * faceSpan
        let half = randIn(half.lowerBound, half.upperBound) * faceSpan
        let colour = PAINT[n % PAINT.count]
        let seed = 60 + n

        let ux = -cos(angle), uy = sin(angle)
        var t = 0.0
        while t < length {
            let px = startX + ux * t
            let py = startY + uy * t

            // Tapered at both ends, and eaten into along its length so the
            // stroke shows the grain of a dry brush.
            let taper = sin(t / length * Double.pi).squareRoot()
            let halfWidth = half * taper

            var offset = -halfWidth
            while offset <= halfWidth {
                let bx = Int((px - uy * offset).rounded())
                let by = Int((py + ux * offset).rounded())
                offset += 0.5
                guard bx >= 0, bx < width, by >= 0, by < height else { continue }

                let i = by * width + bx
                guard paintZone[i] > 0.5 else { continue }

                let grain = noiseAt(t / 9, offset / 2.4, seed: seed)
                let rim = 1 - abs(offset) / max(halfWidth, 0.001)
                guard grain < rim * 0.95 else { continue }

                // Tone decides how much of a stroke lands, not how transparent
                // it is. Multiplied into the alpha instead, every mark comes
                // out half dissolved into the page and the whole half turns
                // pale: his paint is opaque and the paper shows in the gaps.
                guard noiseAt(Double(bx) / 14, Double(by) / 14, seed: 21) < wantsPaint(i)
                else { continue }

                let alpha = min(1, rim * 2.6)

                // Paint is opaque: a stroke laid later covers one laid earlier
                // rather than mixing with it, which is what keeps the colours
                // separate instead of turning the whole half to mud.
                if alpha > 0.25 {
                    paintColour[i] = colour
                    paintAlpha[i] = max(paintAlpha[i], alpha)
                }
            }
            t += 0.5
        }
    }
}

// The body first, in long marks, then the head again in shorter ones. Two
// passes because a single scatter over the whole figure puts almost everything
// on the body: it is four times the area, and the reference's density is on
// the face.
//
// The body is left deliberately open. His t-shirt is white and reads as
// nothing, which is what keeps the eye on the head; painted at the density of
// the face this shirt is a loud triangle of colour and wins the composition
// outright. Fewer strokes, more paper between them, same treatment.
layPaint(count: 150, rows: 0..<height, length: 0.6...1.8, half: 0.09...0.19)
layPaint(count: 420, rows: 0..<neckY, length: 0.30...0.85, half: 0.05...0.12)

// ---------------------------------------------------------------------------
// The two treatments
// ---------------------------------------------------------------------------

/// The photographic treatment: the photograph's own colour, opened in contrast.
///
/// The reference grades his photo half down in saturation as well. That is not
/// carried over: the paint has already taken every shape on the other side, so
/// colour is what is left to tell the two halves apart, and half of it thrown
/// away leaves the photograph looking like a third treatment rather than the
/// picture the paint was made from. Only the tone is touched, and only enough
/// to lift the figure off white paper.
func photographic(_ i: Int) -> Colour {
    let r = Double(photo[i * 4 + 0]) / 255
    let g = Double(photo[i * 4 + 1]) / 255
    let b = Double(photo[i * 4 + 2]) / 255
    let lum = 0.299 * r + 0.587 * g + 0.114 * b
    let v = min(1, max(0, (lum - 0.48) * 1.30 + 0.5))
    return (
        min(1, max(0, v + r - lum)),
        min(1, max(0, v + g - lum)),
        min(1, max(0, v + b - lum))
    )
}

/// The painted treatment: solid ink shapes over the paint.
///
/// - Returns: the colour and how opaque it is; paper is fully transparent, so
///   the page shows through exactly as it does on the reference.
func painted(_ i: Int, _ x: Int, _ y: Int) -> (Colour, Double) {
    // Every ink boundary is torn along the brush direction. A shape that keeps
    // the clean rim of the polygon or the threshold it came from reads as
    // vector art, and it is the single thing that gives the reference's hair
    // its spikes and its blots their bite.
    let ragged = streak(x, y, angle: -1.16, along: 90, across: 8, seed: 11)

    // Half, not less: the blur that softened these shapes spreads their
    // coverage outwards, so any cut below half grows every one of them.
    if inkField[i] > 0.5 + (ragged - 0.5) * 0.42 { return (INK, 1) }

    let paint = paintColour[i]
    let paintAlpha = paintAlpha[i]

    // Creases, inked wherever they fall: on the head the fold of an eyelid or
    // the line of an ear, below it the folds of the cloth, which once the body
    // is painted too are the only drawing the body gets. Gated to the figure,
    // because the strongest gradients in the frame are in the room behind it.
    let crease = smoothstep(0.40, 0.66, edges[i] + (ragged - 0.5) * 0.10)
        * maskAt(i * 4)
    if crease <= 0.002 { return (paint, paintAlpha) }

    // Source-over. Compositing rather than replacing is what keeps a halo of
    // bare paper from opening along every crease that crosses a stroke.
    let alpha = crease + paintAlpha * (1 - crease)
    guard alpha > 0.001 else { return (paint, 0) }
    let behind = paintAlpha * (1 - crease)
    return ((
        (INK.r * crease + paint.r * behind) / alpha,
        (INK.g * crease + paint.g * behind) / alpha,
        (INK.b * crease + paint.b * behind) / alpha
    ), alpha)
}

// ---------------------------------------------------------------------------
// The composition
// ---------------------------------------------------------------------------

let originX = faceX - cropW / 2

enum Treatment { case photo, paint }

/// Renders one full composition.
///
/// - Parameter treatment: which of the two to lay down
/// - Returns: a top-down RGBA8 buffer, cropW by cropH
func build(_ treatment: Treatment) -> [UInt8] {
    var out = [UInt8](repeating: 0, count: cropW * cropH * 4)

    for y in 0..<cropH {
        let sourceY = cropY + y
        guard sourceY >= 0, sourceY < height else { continue }
        for x in 0..<cropW {
            let sourceX = originX + x
            guard sourceX >= 0, sourceX < width else { continue }

            let i = sourceY * width + sourceX

            let colour: Colour
            let alpha: Double

            // The reference paints the head and leaves the t-shirt identical
            // across the seam, which works because his shirt is white and
            // reads as nothing. A dark shirt filling half the frame does not:
            // left photographic it is a photograph with a small drawing on
            // top. So the treatment runs over the whole figure.
            //
            // The painted half is cut to the torn zone rather than to the mask
            // itself, so it keeps a silhouette but not a scissor edge. Cut to
            // nothing at all it stops having an outline: on his half that
            // works, because the paint is dense enough to be the shape, and
            // here the body is sparse and simply dissolves.
            if treatment == .paint {
                let (paintColour, paintAlpha) = painted(i, sourceX, sourceY)
                (colour, alpha) = (paintColour, paintAlpha * paintZone[i])
            } else {
                let cut = maskAt(i * 4)
                (colour, alpha) = (photographic(i), cut)
            }
            if alpha <= 0 { continue }

            let to = (y * cropW + x) * 4
            out[to + 0] = UInt8(colour.r * 255)
            out[to + 1] = UInt8(colour.g * 255)
            out[to + 2] = UInt8(colour.b * 255)
            out[to + 3] = UInt8(alpha * 255)
        }
    }

    return out
}

// ---------------------------------------------------------------------------
// The strokes block
// ---------------------------------------------------------------------------

/// The loose cluster of brush strokes that sits under the painted side, the
/// equivalent of the reference's designer-bg. Drawn as tapered strokes rather
/// than sampled from the photograph, because nothing of the subject is in it.
///
/// - Parameters:
///   - w: block width
///   - h: block height
/// - Returns: a top-down RGBA8 buffer, w by h
func buildStrokes(w: Int, h: Int) -> [UInt8] {
    var out = [UInt8](repeating: 0, count: w * h * 4)

    struct Stroke {
        var x0: Double, y0: Double, x1: Double, y1: Double
        var thickness: Double
        var colour: Colour
        var seed: Int
    }

    var strokes: [Stroke] = []
    for i in 0..<11 {
        let startX = randIn(0.02, 0.42) * Double(w)
        let startY = randIn(0.62, 1.02) * Double(h)
        let angle = randIn(-1.30, -0.75)
        let length = randIn(0.42, 0.95) * Double(h)
        strokes.append(Stroke(
            x0: startX,
            y0: startY,
            x1: startX + cos(angle) * length * -1,
            y1: startY + sin(angle) * length,
            thickness: randIn(0.05, 0.14) * Double(h),
            colour: PAINT[i % PAINT.count],
            seed: 40 + i
        ))
    }

    for stroke in strokes {
        let dx = stroke.x1 - stroke.x0
        let dy = stroke.y1 - stroke.y0
        let length = (dx * dx + dy * dy).squareRoot()
        guard length > 1 else { continue }
        let ux = dx / length, uy = dy / length

        var t = 0.0
        while t < length {
            let px = stroke.x0 + ux * t
            let py = stroke.y0 + uy * t
            let along = t / length

            // Tapered at both ends, and eaten into along its length so the
            // stroke shows the grain of a dry brush.
            let taper = sin(along * Double.pi).squareRoot()
            let halfWidth = stroke.thickness * taper

            var offset = -halfWidth
            while offset <= halfWidth {
                let bx = Int((px - uy * offset).rounded())
                let by = Int((py + ux * offset).rounded())
                t += 0
                if bx >= 0, bx < w, by >= 0, by < h {
                    let grain = noiseAt(t / 9, offset / 2.4, seed: stroke.seed)
                    let rim = 1 - abs(offset) / max(halfWidth, 0.001)
                    if grain < rim * 0.95 {
                        let alpha = min(1, rim * 2.2) * randIn(0.72, 1.0)
                        let to = (by * w + bx) * 4
                        if alpha * 255 > Double(out[to + 3]) {
                            out[to + 0] = UInt8(stroke.colour.r * 255)
                            out[to + 1] = UInt8(stroke.colour.g * 255)
                            out[to + 2] = UInt8(stroke.colour.b * 255)
                            out[to + 3] = UInt8(alpha * 255)
                        }
                    }
                }
                offset += 0.5
            }
            t += 0.5
        }
    }

    return out
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/// Scales a buffer up and writes it as a PNG.
func writePNG(_ pixels: [UInt8], w: Int, h: Int, targetW: Int, to url: URL) throws {
    guard let provider = CGDataProvider(data: Data(pixels) as CFData),
          let image = CGImage(
            width: w, height: h,
            bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: w * 4,
            space: rgb,
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue),
            provider: provider, decode: nil,
            shouldInterpolate: true, intent: .defaultIntent
          )
    else { throw NSError(domain: "hero", code: 1) }

    let targetH = Int((Double(targetW) * Double(h) / Double(w)).rounded())

    guard let canvas = CGContext(
        data: nil, width: targetW, height: targetH,
        bitsPerComponent: 8, bytesPerRow: targetW * 4, space: rgb,
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
    ) else { throw NSError(domain: "hero", code: 2) }

    canvas.interpolationQuality = .high
    canvas.draw(image, in: CGRect(x: 0, y: 0, width: targetW, height: targetH))

    guard let scaled = canvas.makeImage(),
          let destination = CGImageDestinationCreateWithURL(
            url as CFURL, UTType.png.identifier as CFString, 1, nil)
    else { throw NSError(domain: "hero", code: 3) }

    CGImageDestinationAddImage(destination, scaled, nil)
    guard CGImageDestinationFinalize(destination) else {
        throw NSError(domain: "hero", code: 4)
    }

    print("wrote \(targetW)x\(targetH) to \(url.lastPathComponent)")
}

let photoComposition = build(.photo)
let paintComposition = build(.paint)

try writePNG(photoComposition, w: cropW, h: cropH, targetW: outW,
             to: URL(fileURLWithPath: "\(prefix)-photo.png"))
try writePNG(paintComposition, w: cropW, h: cropH, targetW: outW,
             to: URL(fileURLWithPath: "\(prefix)-paint.png"))

// The flat composite: painted to the left of the seam, photographic to the
// right, which is the resting state frozen into one image. Narrow screens get
// this instead of the sliding pair, exactly as the reference serves a single
// jpg below its own breakpoint.
var flat = photoComposition
for y in 0..<cropH {
    for x in 0..<(cropW / 2) {
        let i = (y * cropW + x) * 4
        flat[i + 0] = paintComposition[i + 0]
        flat[i + 1] = paintComposition[i + 1]
        flat[i + 2] = paintComposition[i + 2]
        flat[i + 3] = paintComposition[i + 3]
    }
}
try writePNG(flat, w: cropW, h: cropH, targetW: outW,
             to: URL(fileURLWithPath: "\(prefix)-face.png"))

// The strokes block is half the composition wide and a third of it high, the
// same proportion the reference gives its 420x200 block against 840x600.
let strokesW = 420, strokesH = 200
try writePNG(buildStrokes(w: strokesW, h: strokesH),
             w: strokesW, h: strokesH, targetW: strokesW * 2,
             to: URL(fileURLWithPath: "\(prefix)-strokes.png"))
