import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
import AppKit

// Draws the shoulder contour onto the painted side of the hero.
//
// The painted composition has no outline anywhere, which is right for the head:
// the reference draws a face with five or six solid shapes and no contour at
// all, and the hair is a mass, not a line. It is wrong for the shoulder. The
// head has enough ink in it to hold its own shape, and the body does not: it is
// sparse colour over bare paper, so where the figure ends is a guess. One brush
// line down the shoulder is all it takes, and it is the only line the whole
// composition gets.
//
// It runs after hero.swift rather than inside it because the mark is measured
// in the finished composition: it sits on the silhouette that the photographic
// half already carries in its alpha, and it has to land on the same pixels in
// the painted image and in the flat composite. Tracing the alpha is also what
// lets the line be redrawn without the source photograph, which the paint
// itself cannot be.
//
// usage: shoulder <prefix> <cropW> <fromY> <toY> <thickness>
//
//   cropW       the crop width hero.swift was given, which is the size the
//               composition was drawn at before it was enlarged. The mark is
//               drawn at that size too and enlarged the same way, because the
//               enlargement is half of what the other ink looks like.
//   fromY       first row of the contour, where the neck meets the shoulder
//   toY         last row, where the brush lifts off along the arm
//   thickness   width of the line at its fattest
//
// fromY, toY and thickness are in the finished image's pixels, which is what
// one measures by eye off the PNG.
//
// reads <prefix>-photo.png for the silhouette and rewrites <prefix>-paint.png
// and <prefix>-face.png in place. Run it twice and the line is drawn twice, so
// it belongs immediately after hero.swift and nowhere else. The webp beside
// each png has to be made again afterwards.

let args = CommandLine.arguments
guard args.count >= 6,
      let cropW = Int(args[2]),
      let fromY = Int(args[3]),
      let toY = Int(args[4]),
      let thickness = Double(args[5])
else {
    FileHandle.standardError.write(
        "usage: shoulder <prefix> <cropW> <fromY> <toY> <thickness>\n"
            .data(using: .utf8)!)
    exit(2)
}

let prefix = args[1]

// ---------------------------------------------------------------------------
// Reading and writing
// ---------------------------------------------------------------------------

/// One decoded image: straight RGBA8, top-down, as hero.swift wrote it.
struct Bitmap {
    var pixels: [UInt8]
    let width: Int
    let height: Int
}

/// Reads a PNG without going through a CGContext.
///
/// Drawing it into a context would premultiply the alpha, and writing it back
/// out would divide it away again, which re-quantises every semi-transparent
/// pixel in the image on every run. The decoded bytes are already the straight
/// RGBA the file holds, so they are taken as they are.
func read(_ path: String) -> Bitmap {
    guard let source = CGImageSourceCreateWithURL(
            URL(fileURLWithPath: path) as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil),
          let data = image.dataProvider?.data
    else {
        FileHandle.standardError.write("cannot read \(path)\n".data(using: .utf8)!)
        exit(1)
    }

    guard image.bitsPerPixel == 32,
          image.bitsPerComponent == 8,
          image.alphaInfo == .last,
          image.bytesPerRow == image.width * 4
    else {
        FileHandle.standardError.write(
            "\(path) is not straight RGBA8\n".data(using: .utf8)!)
        exit(1)
    }

    return Bitmap(
        pixels: [UInt8](data as Data),
        width: image.width,
        height: image.height
    )
}

/// Writes a bitmap back out at its own size.
func write(_ bitmap: Bitmap, to path: String) {
    guard let provider = CGDataProvider(data: Data(bitmap.pixels) as CFData),
          let image = CGImage(
            width: bitmap.width, height: bitmap.height,
            bitsPerComponent: 8, bitsPerPixel: 32, bytesPerRow: bitmap.width * 4,
            space: CGColorSpaceCreateDeviceRGB(),
            bitmapInfo: CGBitmapInfo(rawValue: CGImageAlphaInfo.last.rawValue),
            provider: provider, decode: nil,
            shouldInterpolate: true, intent: .defaultIntent
          ),
          let destination = CGImageDestinationCreateWithURL(
            URL(fileURLWithPath: path) as CFURL,
            UTType.png.identifier as CFString, 1, nil)
    else {
        FileHandle.standardError.write("cannot write \(path)\n".data(using: .utf8)!)
        exit(1)
    }

    CGImageDestinationAddImage(destination, image, nil)
    guard CGImageDestinationFinalize(destination) else {
        FileHandle.standardError.write("cannot write \(path)\n".data(using: .utf8)!)
        exit(1)
    }

    print("wrote \(bitmap.width)x\(bitmap.height) to \(URL(fileURLWithPath: path).lastPathComponent)")
}

// ---------------------------------------------------------------------------
// Noise
// ---------------------------------------------------------------------------

// Transcribed from hero.swift, which is the only place the tear this line needs
// is defined. Swift allows top-level code in one file per binary, so two
// command-line tools cannot share a source file without becoming a package, and
// these thirty lines are not worth that.

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
func streak(
    _ x: Int, _ y: Int, angle: Double, along: Double, across: Double, seed: Int
) -> Double {
    let c = cos(angle), s = sin(angle)
    let u = (Double(x) * c + Double(y) * s) / along
    let v = (-Double(x) * s + Double(y) * c) / across
    return noiseAt(u, v, seed: seed)
}

// ---------------------------------------------------------------------------
// The contour
// ---------------------------------------------------------------------------

let photo = read("\(prefix)-photo.png")
let width = photo.width
let height = photo.height

/// The ink the features are drawn in, from hero.swift.
let INK: (r: Double, g: Double, b: Double) = (0.07, 0.07, 0.08)

/// The tear, transcribed from hero.swift.
let TEAR = (angle: -1.16, along: 90.0, across: 8.0, seed: 11)

/// How much hero.swift enlarged the composition on its way out.
///
/// The mark is drawn at the crop's size and enlarged by this, rather than drawn
/// at the finished size, and the difference is not subtle. Everything else in
/// the image went through that enlargement, so every torn edge in it is a
/// couple of soft output pixels wide and steps in blocks. A line drawn straight
/// at the finished size comes out clean to the pixel, and next to that paint it
/// reads as something pasted on rather than something drawn.
let scale = Double(width) / Double(cropW)
let grid = (w: cropW, h: Int((Double(height) / scale).rounded()))

/// The leftmost column the figure occupies in a row, or nil where it occupies
/// none.
func edge(_ y: Int) -> Double? {
    for x in 0..<width where photo.pixels[(y * width + x) * 4 + 3] > 127 {
        return Double(x)
    }
    return nil
}

/// The silhouette's left edge over the requested rows, averaged along the way.
///
/// The mask comes back with a pixel or two of wobble in it, and traced exactly
/// the line inherits every one of them. A brush drawn along a shoulder does not
/// wobble: it takes the sweep and leaves the detail out.
func contour() -> [CGPoint] {
    let span = 24
    var points: [CGPoint] = []

    for y in fromY...toY {
        var sum = 0.0
        var count = 0.0
        for k in -span...span {
            let row = min(height - 1, max(0, y + k))
            guard let at = edge(row) else { continue }
            sum += at
            count += 1
        }
        guard count > 0 else { continue }
        points.append(CGPoint(x: sum / count, y: Double(y)))
    }

    return points
}

/// How deep inside the line a pixel is: 1 along the centre, 0 at the rim, over
/// the crop's grid rather than the finished image's.
///
/// The mark is kept as a depth rather than as coverage because the tear below
/// needs to know how far it is eating in. Coverage would only say whether a
/// pixel is ink.
var depth = [Double](repeating: 0, count: grid.w * grid.h)

/// Lays a disc of ink.
func stamp(_ px: Double, _ py: Double, radius: Double) {
    let x0 = max(0, Int(px - radius) - 1)
    let x1 = min(grid.w - 1, Int(px + radius) + 1)
    let y0 = max(0, Int(py - radius) - 1)
    let y1 = min(grid.h - 1, Int(py + radius) + 1)
    guard x0 <= x1, y0 <= y1 else { return }

    for y in y0...y1 {
        for x in x0...x1 {
            let dx = Double(x) - px, dy = Double(y) - py
            let distance = (dx * dx + dy * dy).squareRoot()
            let i = y * grid.w + x
            depth[i] = max(depth[i], max(0, 1 - distance / max(radius, 0.001)))
        }
    }
}

let points = contour()
guard points.count >= 2 else {
    FileHandle.standardError.write(
        "no silhouette between rows \(fromY) and \(toY)\n".data(using: .utf8)!)
    exit(1)
}

// A brush bears down in the middle of a mark and lifts at its ends, and it is
// the lifting that keeps this from reading as a cutout: the line has to start
// out of nothing at the neck and run out into the arm rather than stop.
let taper = 0.92
var walked = 0.0
let total: Double = zip(points, points.dropFirst()).reduce(0) {
    $0 + hypot($1.1.x - $1.0.x, $1.1.y - $1.0.y)
}

for (from, to) in zip(points, points.dropFirst()) {
    let span = hypot(to.x - from.x, to.y - from.y)
    let steps = max(1, Int(span * 2))

    for step in 0..<steps {
        let t = Double(step) / Double(steps)
        let along = (walked + span * t) / total
        let weight = 1 - taper * (1 - sin(along * Double.pi))
        stamp(
            (Double(from.x) + Double(to.x - from.x) * t) / scale,
            (Double(from.y) + Double(to.y - from.y) * t) / scale,
            radius: thickness * 0.5 * weight / scale
        )
    }

    walked += span
}

/// Coverage of the line over the crop's grid, 0 to 1 per pixel, once torn.
var drawn = [Double](repeating: 0, count: grid.w * grid.h)

// Torn along the brush direction, the way every other ink shape in the
// composition is. A line with the clean rim of the disc it was stamped from
// reads as vector art next to the hair, and it is the tear more than the shape
// that makes a mark look laid down by hand.
//
// The core is left alone and the outer band is eaten: a pixel survives if it
// lies deeper in the line than the noise at that point asks for, so the notches
// come out as long as the noise is long, and the line changes width along its
// run without ever breaking.
let BAND = 0.55

for y in 0..<grid.h {
    for x in 0..<grid.w {
        let i = y * grid.w + x
        guard depth[i] > 0 else { continue }

        // Cut hard, as hero.swift cuts its ink. The mark is meant to come out
        // of the enlargement with the same stepped, softened rim the paint has,
        // and an edge antialiased here as well arrives at twice that width and
        // reads as a blur beside it.
        let bite = streak(x, y, angle: TEAR.angle, along: TEAR.along,
                          across: TEAR.across, seed: TEAR.seed)
        drawn[i] = depth[i] / BAND > bite ? 1 : 0
    }
}

// ---------------------------------------------------------------------------
// Output
// ---------------------------------------------------------------------------

/// The line at the finished image's size, enlarged the way hero.swift enlarges
/// the compositions: one grey channel through Core Graphics at high quality, so
/// the mark picks up the same soft blocky edge as the paint it lands on.
let line: [Double] = {
    var grey = drawn.map { UInt8(($0 * 255).rounded()) }
    let space = CGColorSpaceCreateDeviceGray()

    guard let provider = CGDataProvider(data: Data(grey) as CFData),
          let small = CGImage(
            width: grid.w, height: grid.h,
            bitsPerComponent: 8, bitsPerPixel: 8, bytesPerRow: grid.w,
            space: space, bitmapInfo: CGBitmapInfo(rawValue: 0),
            provider: provider, decode: nil,
            shouldInterpolate: true, intent: .defaultIntent
          ),
          let canvas = CGContext(
            data: nil, width: width, height: height,
            bitsPerComponent: 8, bytesPerRow: width, space: space,
            bitmapInfo: CGImageAlphaInfo.none.rawValue
          )
    else {
        FileHandle.standardError.write("cannot enlarge the line\n".data(using: .utf8)!)
        exit(1)
    }

    canvas.interpolationQuality = .high
    canvas.draw(small, in: CGRect(x: 0, y: 0, width: width, height: height))

    guard let raster = canvas.data else { exit(1) }
    grey = [UInt8](UnsafeBufferPointer(
        start: raster.assumingMemoryBound(to: UInt8.self),
        count: width * height))
    return grey.map { Double($0) / 255 }
}()

/// Composites the line over a bitmap, source-over in straight alpha.
///
/// - Parameters:
///   - bitmap: the image to draw into
///   - upTo: the first column the line may not touch, so the flat composite
///     keeps the photograph on its side of the seam whatever the crop does
func draw(into bitmap: inout Bitmap, upTo: Int) {
    for y in 0..<height {
        for x in 0..<min(upTo, width) {
            let i = y * width + x
            let coverage = line[i]
            guard coverage > 0 else { continue }

            let behind = Double(bitmap.pixels[i * 4 + 3]) / 255 * (1 - coverage)
            let alpha = coverage + behind
            guard alpha > 0.001 else { continue }

            func mix(_ channel: Int, _ ink: Double) -> UInt8 {
                let under = Double(bitmap.pixels[i * 4 + channel]) / 255
                return UInt8(min(255, max(0,
                    ((ink * coverage + under * behind) / alpha * 255).rounded())))
            }

            bitmap.pixels[i * 4 + 0] = mix(0, INK.r)
            bitmap.pixels[i * 4 + 1] = mix(1, INK.g)
            bitmap.pixels[i * 4 + 2] = mix(2, INK.b)
            bitmap.pixels[i * 4 + 3] = UInt8((alpha * 255).rounded())
        }
    }
}

var paint = read("\(prefix)-paint.png")
draw(into: &paint, upTo: width)
write(paint, to: "\(prefix)-paint.png")

// The flat composite is painted to the left of the seam and photographic to the
// right, so the line stops at the seam exactly as the paint does.
var face = read("\(prefix)-face.png")
draw(into: &face, upTo: width / 2)
write(face, to: "\(prefix)-face.png")
