import React, { useState, useEffect } from 'react';
import { storage, DEFAULT_FALLBACK_IMAGE } from '../../lib/storage';
import { ImageCategory } from '../../types';

export const DEFAULT_AVATAR_IMAGE = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="%23064e3b"/><circle cx="100" cy="75" r="38" fill="%2334d399"/><path d="M40 180 C40 135 65 120 100 120 C135 120 160 135 160 180 Z" fill="%2334d399"/></svg>`;

export const DEFAULT_BOOK_COVER = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600"><rect width="400" height="600" fill="%231e293b"/><rect x="25" y="25" width="350" height="550" rx="12" fill="%230f172a" stroke="%23334155" stroke-width="2"/><circle cx="200" cy="240" r="45" fill="%23064e3b"/><path d="M185 225 h30 v30 h-30 z" fill="%2334d399"/><text x="200" y="340" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23f8fafc" text-anchor="middle">বইয়ের প্রচ্ছদ</text><text x="200" y="375" font-family="sans-serif" font-size="13" fill="%2394a3b8" text-anchor="middle">স্পিকার আঃ জব্বার খান স্মৃতি লাইব্রেরি</text></svg>`;

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  category?: ImageCategory | string;
  fallbackSrc?: string;
  alt: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  category = 'general',
  fallbackSrc,
  alt,
  className = '',
  ...props
}) => {
  const getCategoryFallback = () => {
    if (fallbackSrc) return fallbackSrc;
    if (category === 'avatar' || category === 'member_photo') return DEFAULT_AVATAR_IMAGE;
    if (category === 'book' || category === 'book_cover') return DEFAULT_BOOK_COVER;
    if (category === 'logo') return '/logo.png';
    return DEFAULT_FALLBACK_IMAGE;
  };

  const resolveImage = (rawSrc?: string | null): string => {
    if (!rawSrc || rawSrc.trim() === '') {
      return getCategoryFallback();
    }
    const clean = rawSrc.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:image/') || clean.startsWith('/')) {
      return clean;
    }
    const resolved = storage.resolveImageUrl(clean, category);
    if (!resolved || resolved === DEFAULT_FALLBACK_IMAGE) {
      return getCategoryFallback();
    }
    return resolved;
  };

  const [resolvedSrc, setResolvedSrc] = useState<string>(() => resolveImage(src));
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    setResolvedSrc(resolveImage(src));
  }, [src, category, fallbackSrc]);

  // Listen for global media update event
  useEffect(() => {
    const handleMediaUpdated = () => {
      setHasError(false);
      setResolvedSrc(resolveImage(src));
    };

    window.addEventListener('sajks_media_updated', handleMediaUpdated);
    return () => {
      window.removeEventListener('sajks_media_updated', handleMediaUpdated);
    };
  }, [src, category]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setResolvedSrc(getCategoryFallback());
    }
  };

  return (
    <img
      {...props}
      src={hasError ? getCategoryFallback() : resolvedSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};
