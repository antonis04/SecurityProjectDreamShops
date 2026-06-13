export const API_BASE = 'http://localhost:9191/api/v1';

/** Build an absolute image URL from a product image's downloadUrl. */
export function imageUrl(downloadUrl: string | undefined): string | null {
  if (!downloadUrl) return null;
  return downloadUrl.startsWith('http') ? downloadUrl : `http://localhost:9191${downloadUrl}`;
}
