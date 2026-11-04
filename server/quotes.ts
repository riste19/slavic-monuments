import { env } from 'cloudflare:workers';
export const runtime = () => env as unknown as { DB: D1Database; BUCKET: R2Bucket; QUOTE_ADMIN_EMAIL?: string };
export function json(value: unknown, status = 200) { return Response.json(value, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }); }
export function isAdmin(request: Request) {
  const email = request.headers.get('oai-authenticated-user-email');
  return Boolean(request.headers.get('oai-authenticated-user-id') && email && runtime().QUOTE_ADMIN_EMAIL && email.toLowerCase() === runtime().QUOTE_ADMIN_EMAIL!.toLowerCase());
}
export function escapeHtml(value: unknown) { return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
export async function limitedForm(request: Request, max = 16 * 1024 * 1024) {
  if (Number(request.headers.get('content-length') || 0) > max) throw new Error('Upload too large');
  const reader = request.body?.getReader(); if (!reader) throw new Error('No body');
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > max) { await reader.cancel(); throw new Error('Upload too large'); } chunks.push(value); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new Response(bytes, { headers: { 'Content-Type': request.headers.get('content-type') || '' } }).formData();
}
export async function photoType(file: File) {
  const b = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  if (b[0] === 255 && b[1] === 216 && b[2] === 255) return 'image/jpeg';
  if ([137,80,78,71,13,10,26,10].every((v,i) => b[i] === v)) return 'image/png';
  if (String.fromCharCode(...b.slice(0,4)) === 'RIFF' && String.fromCharCode(...b.slice(8,12)) === 'WEBP') return 'image/webp';
  return null;
}
