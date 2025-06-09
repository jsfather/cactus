'use client';

import { useEffect, useRef } from 'react';

interface ClientVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export function ClientVideo({ src, className, ...props }: ClientVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      suppressHydrationWarning
      {...props}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
