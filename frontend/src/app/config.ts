// Change this to your PHP backend's public URL once deployed.
// Local development default assumes `php -S localhost:8000 -t public` run
// from inside the `backend` folder (see backend/README.md).
export const API_BASE_URL = 'http://localhost:8000/api';

// The backend's origin (no /api suffix) — uploaded photos are served from
// here, e.g. http://localhost:8000/uploads/xxx.jpg, not from the Angular
// dev server, so image paths returned by the API must be resolved against it.
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function resolveImageUrl(path?: string | null): string {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path; // already absolute
  return API_ORIGIN + (path.startsWith('/') ? path : '/' + path);
}

export const WHATSAPP_NUMBER = '923318889902';
export const RESTAURANT_NAME = 'Shahi Angaar';