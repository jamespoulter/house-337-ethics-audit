import { images } from './images'

// Get public URLs for all assets
export const assets = {
  ...images,
  favicon: images.favicon.src,
  icon: images.icon.src,
  appleTouchIcon: images.appleTouchIcon.src,
} as const 