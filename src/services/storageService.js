import { supabase } from '../supabaseClient';

export const BUCKET_NAME = 'app-files';

// In-memory cache for signed URLs to prevent refetching during session
const signedUrlCache = new Map();

/**
 * Storage Service for YUKTI Agricultural Platform
 * Uploads, signs, and deletes files from private Supabase bucket: "app-files"
 * Enforces path convention: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
 */
export const storageService = {
  /**
   * Upload a file to the "app-files" private bucket
   * @param {Object} params
   * @param {File} params.file - Browser File or Blob
   * @param {string} params.userId - Authenticated User ID (auth.uid())
   * @param {string} params.featureName - e.g. 'equipment', 'avatar', 'jobs', 'messages'
   * @param {string} [params.itemId] - Item/Entity ID (e.g. equipment ID, job ID, message ID)
   * @returns {Promise<{ path: string, signedUrl: string }>}
   */
  async uploadFile({ file, userId, featureName, itemId = 'general' }) {
    if (!userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be authenticated to upload files.');
      userId = user.id;
    }

    if (!file) throw new Error('No file provided for upload.');

    // Clean extension
    const nameParts = file.name ? file.name.split('.') : ['file', 'png'];
    const rawExt = nameParts.length > 1 ? nameParts.pop().toLowerCase() : 'png';
    const extension = rawExt.replace(/[^a-z0-9]/gi, '') || 'png';
    const fileUuid = crypto.randomUUID();

    // Required folder structure: ${auth.uid()}/${featureName}/${itemId}/${uuid}.${extension}
    const cleanFeature = featureName.replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'uploads';
    const cleanItemId = String(itemId).replace(/[^a-z0-9_-]/gi, '') || 'item';
    const storagePath = `${userId}/${cleanFeature}/${cleanItemId}/${fileUuid}.${extension}`;

    // Upload to private bucket
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type || undefined
      });

    if (error) {
      console.error('Supabase Storage upload error:', error);
      throw error;
    }

    const uploadedPath = data?.path || storagePath;

    // Generate signed URL immediately for fast preview
    let initialSignedUrl = '';
    try {
      initialSignedUrl = await this.getSignedUrl(uploadedPath, 3600);
    } catch (e) {
      console.warn('Could not generate initial signed URL:', e);
    }

    return {
      path: uploadedPath,
      signedUrl: initialSignedUrl
    };
  },

  /**
   * Get a signed URL for a file in the private bucket
   * @param {string} filePath - Path in bucket (e.g. ${userId}/${featureName}/...)
   * @param {number} expiresIn - Expiry in seconds (default: 3600 = 1 hour)
   * @returns {Promise<string|null>}
   */
  async getSignedUrl(filePath, expiresIn = 3600) {
    if (!filePath) return null;

    // If it's already an external HTTP URL (e.g. Unsplash sample), return as-is
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      // Check if it's an expired Supabase signed URL or direct storage URL
      if (!filePath.includes('/storage/v1/object/')) {
        return filePath;
      }
    }

    // Strip bucket prefix if present
    const cleanPath = filePath.replace(/^app-files\//, '');

    // Check cache (with 10-minute safety window before expiry)
    const cached = signedUrlCache.get(cleanPath);
    if (cached && cached.expiresAt > Date.now() + 600000) {
      return cached.url;
    }

    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .createSignedUrl(cleanPath, expiresIn);

      if (error || !data?.signedUrl) {
        console.warn('Could not create signed URL for:', cleanPath, error?.message);
        return null;
      }

      signedUrlCache.set(cleanPath, {
        url: data.signedUrl,
        expiresAt: Date.now() + expiresIn * 1000
      });

      return data.signedUrl;
    } catch (err) {
      console.warn('Storage getSignedUrl exception:', err.message);
      return null;
    }
  },

  /**
   * Batch create signed URLs for an array of file paths
   * @param {string[]} filePaths
   * @param {number} expiresIn
   * @returns {Promise<Record<string, string>>} Map of filePath -> signedUrl
   */
  async getSignedUrls(filePaths, expiresIn = 3600) {
    const results = {};
    if (!Array.isArray(filePaths) || filePaths.length === 0) return results;

    await Promise.all(
      filePaths.map(async (path) => {
        if (path) {
          results[path] = await this.getSignedUrl(path, expiresIn);
        }
      })
    );

    return results;
  },

  /**
   * Delete a file from the private bucket
   * @param {string} filePath - Path in bucket
   * @returns {Promise<boolean>}
   */
  async deleteFile(filePath) {
    if (!filePath) return true;

    // If it's an external URL not belonging to storage, ignore
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      if (!filePath.includes(BUCKET_NAME)) {
        return true;
      }
    }

    const cleanPath = filePath.replace(/^app-files\//, '');
    signedUrlCache.delete(cleanPath);

    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([cleanPath]);

      if (error) {
        console.warn('Supabase storage delete error:', error.message);
        return false;
      }
      return true;
    } catch (e) {
      console.warn('Supabase storage delete exception:', e.message);
      return false;
    }
  }
};
