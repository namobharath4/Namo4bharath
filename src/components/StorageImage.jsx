import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

/**
 * StorageImage component for displaying files stored in private Supabase Storage ("app-files").
 * Automatically resolves and caches signed URLs for storage paths,
 * while transparently falling back to standard URLs or fallback placeholders.
 */
export default function StorageImage({ 
  src, 
  alt = 'Image', 
  fallbackSrc = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=500&auto=format&fit=crop&q=80', 
  style = {}, 
  className = '', 
  loading = 'lazy',
  ...props 
}) {
  const [displayUrl, setDisplayUrl] = useState(fallbackSrc);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!src) {
      setDisplayUrl(fallbackSrc);
      return;
    }

    // Direct HTTP(S) URL that is NOT a private Supabase Storage path
    if ((src.startsWith('http://') || src.startsWith('https://')) && !src.includes('/storage/v1/object/')) {
      setDisplayUrl(src);
      return;
    }

    // Resolve signed URL from Supabase Storage
    storageService.getSignedUrl(src, 3600).then((signed) => {
      if (isMounted) {
        if (signed) {
          setDisplayUrl(signed);
        } else {
          setDisplayUrl(fallbackSrc);
        }
      }
    }).catch(() => {
      if (isMounted) setDisplayUrl(fallbackSrc);
    });

    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc]);

  return (
    <img 
      src={hasError ? fallbackSrc : displayUrl} 
      alt={alt} 
      style={style} 
      className={className} 
      loading={loading}
      onError={() => setHasError(true)}
      {...props} 
    />
  );
}
