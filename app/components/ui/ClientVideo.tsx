'use client';

interface ClientVideoProps {
  src: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  playsInline?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

export function ClientVideo({
  src,
  className,
  controls = false,
  autoPlay = false,
  muted = true,
  loop = true,
  playsInline = true,
  preload = 'metadata'
}: ClientVideoProps) {
  return (
    <video
      src={src}
      className={className}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      preload={preload}
      suppressHydrationWarning
    />
  );
} 