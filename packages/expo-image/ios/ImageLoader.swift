// Copyright 2024-present 650 Industries. All rights reserved.

import SDWebImage

internal final class ImageLoader {
  static let shared = ImageLoader()

  lazy var imageManager = SDWebImageManager(
    cache: SDImageCache.shared,
    loader: SDImageLoadersManager.shared
  )

  func load(_ source: ImageSource) async -> UIImage? {
    return await withCheckedContinuation { continuation in
      imageManager.loadImage(with: source.uri, progress: nil) { image, _, _, _, _, _ in
        continuation.resume(returning: image)
      }
    }
  }
}
