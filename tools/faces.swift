import Foundation
import Vision
import CoreImage

let src = CIImage(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1]))!
let w = src.extent.width, h = src.extent.height
print("image \(Int(w))x\(Int(h))")

let handler = VNImageRequestHandler(ciImage: src, options: [:])
let faces = VNDetectFaceLandmarksRequest()
try handler.perform([faces])

for (i, face) in (faces.results ?? []).enumerated() {
    // Vision boxes are normalised with a bottom-left origin.
    let b = face.boundingBox
    let x = b.minX * w
    let yTop = (1 - b.maxY) * h
    print(String(format: "face %d: x %.0f..%.0f  y %.0f..%.0f  (w %.0f h %.0f)",
                 i, x, x + b.width * w, yTop, yTop + b.height * h,
                 b.width * w, b.height * h))

    if let nose = face.landmarks?.nose {
        let pts = nose.pointsInImage(imageSize: CGSize(width: w, height: h))
        let cx = pts.map(\.x).reduce(0, +) / CGFloat(pts.count)
        let cy = pts.map(\.y).reduce(0, +) / CGFloat(pts.count)
        print(String(format: "   nose centre: x %.0f  y %.0f", cx, h - cy))
    }
    if let eyeL = face.landmarks?.leftEye, let eyeR = face.landmarks?.rightEye {
        let l = eyeL.pointsInImage(imageSize: CGSize(width: w, height: h))
        let r = eyeR.pointsInImage(imageSize: CGSize(width: w, height: h))
        let lx = l.map(\.x).reduce(0, +) / CGFloat(l.count)
        let rx = r.map(\.x).reduce(0, +) / CGFloat(r.count)
        let ly = l.map(\.y).reduce(0, +) / CGFloat(l.count)
        print(String(format: "   eyes: x %.0f and %.0f  y %.0f", lx, rx, h - ly))
    }
}
