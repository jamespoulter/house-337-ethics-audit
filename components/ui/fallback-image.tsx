"use client"

import Image from "next/image"
import { useState } from "react"

interface FallbackImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  invert?: boolean
}

export function FallbackImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  invert = false
}: FallbackImageProps) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-2xl font-bold text-[#FF0055]">{alt}</div>
      </div>
    )
  }

  const imageClasses = `${className} ${invert ? 'invert' : ''}`

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={imageClasses}
      priority={priority}
      quality={90}
      onError={() => setError(true)}
    />
  )
} 