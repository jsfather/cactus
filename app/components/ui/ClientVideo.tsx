'use client';

import { useRef, useEffect, useState } from 'react';
import { VideoOff } from 'lucide-react';

interface ClientVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  fallbackLabel?: string;
}

export function ClientVideo({
  src,
  className,
  fallbackLabel = 'ویدئو در دسترس نیست',
  onError,
  onLoadedMetadata,
  ...props
}: ClientVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [src]);

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400 ${className ?? ''}`}
        role="status"
      >
        <div className="p-6 text-center">
          <VideoOff className="mx-auto h-10 w-10" />
          <p className="mt-2 text-sm">{fallbackLabel}</p>
        </div>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className={className}
      suppressHydrationWarning
      onError={(event) => {
        setHasError(true);
        onError?.(event);
      }}
      onLoadedMetadata={(event) => {
        if (!props.autoPlay && event.currentTarget.duration > 0.1) {
          event.currentTarget.currentTime = 0.1;
        }
        onLoadedMetadata?.(event);
      }}
      {...props}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
