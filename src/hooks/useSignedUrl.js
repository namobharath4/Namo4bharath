import { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';

/**
 * Custom hook to get a signed URL for a file stored in private Supabase Storage ("app-files").
 */
export function useSignedUrl(filePath, fallbackUrl = null) {
  const [signedUrl, setSignedUrl] = useState(fallbackUrl);
  const [loading, setLoading] = useState(Boolean(filePath));

  useEffect(() => {
    let isMounted = true;

    if (!filePath) {
      setSignedUrl(fallbackUrl);
      setLoading(false);
      return;
    }

    if ((filePath.startsWith('http://') || filePath.startsWith('https://')) && !filePath.includes('/storage/v1/object/')) {
      setSignedUrl(filePath);
      setLoading(false);
      return;
    }

    setLoading(true);
    storageService.getSignedUrl(filePath, 3600)
      .then((url) => {
        if (isMounted) {
          setSignedUrl(url || fallbackUrl);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSignedUrl(fallbackUrl);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [filePath, fallbackUrl]);

  return { signedUrl, loading };
}
