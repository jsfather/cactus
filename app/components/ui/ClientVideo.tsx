'use client';

import { useRef, useEffect } from 'react';

interface ClientVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export function ClientVideo({ src, className, ...props }: ClientVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      // Load just enough of the video to show a thumbnail
      videoRef.current.currentTime = 0.1;
      videoRef.current.load();
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
