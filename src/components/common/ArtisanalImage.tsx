import React, { useState } from 'react';
import { CakeSlice } from 'lucide-react';

interface ArtisanalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const ArtisanalImage: React.FC<ArtisanalImageProps> = ({
  src,
  alt,
  className = '',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-sky-200/50 via-[#eef6fc] to-teal-100/60 dark:from-sky-900/50 dark:via-[#0b1829] dark:to-teal-900/40 text-[#0f5a8a] dark:text-[#7dd3fc] ${className}`}
        role="img"
        aria-label={alt}
      >
        <CakeSlice className="w-5 h-5 opacity-75" />
        {fallbackLabel && (
          <span className="mt-1 text-[10px] font-medium px-1 text-center line-clamp-1">
            {fallbackLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
