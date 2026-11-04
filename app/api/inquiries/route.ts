import { json, limitedForm, photoType, runtime } from '../../../server/quotes';
const styles = ['Upright memorial', 'Shared memorial', 'Lawn memorial', 'Help me choose'];
const services = ['New memorial', 'Inscription & details', 'Existing memorial question', 'Help me choose'];
export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) return json({ error: 'Please submit from this website.' }, 403);
  if (!request.headers.get('content-type')?.startsWith('multipart/form-data')) return json({ error: 'Invalid request format.' }, 415);
  let data: FormData; try { data = await limitedForm(request); } catch { return json({ error: 'Keep the total upload below 15 MB.' }, 413); }
  const field = (key: string, max: number) => String(data.get(key) || '').trim().slice(0, max);
  const id = field('requestId', 50), name = field('name', 100), email = field('email', 200), style = field('style', 40), service = field('service', 50);
  if (field('website', 200)) return json({ error: 'Unable to accept this request.' }, 400);
  if (!/^[a-f0-9-]{36}$/.test(id) || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !styles.includes(style) || !services.includes(service) || data.get('consent') !== 'yes') return json({ error: 'Check your name, email, memorial choice and consent.' }, 400);
  const files = data.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > 3) return json({ error: 'Attach no more than three photos.' }, 400);
  const checked: {file: File; mime: string}[] = [];
  for (const file of files) { const mime = await photoType(file); if (file.size > 5 * 1024 * 1024) return json({ error: 'Each photo must be 5 MB or smaller.' }, 400); if (!mime || mime !== file.type) return json({ error: 'Use JPG, PNG or WebP photos.' }, 400); checked.push({file, mime}); }
  const { DB, BUCKET } = runtime(); const keys: string[] = [];
  try {
    if (await DB.prepare('SELECT id FROM inquiries WHERE id=?').bind(id).first()) return json({ ok: true, reference: id });
    const ip = request.headers.get('CF-Connecting-IP') || 'local';
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(ip + new Date().toISOString().slice(0,10))))).map(v => v.toString(16).padStart(2,'0')).join('');
    const now = Date.now();
    const rate = await DB.prepare('SELECT COUNT(*) AS count FROM inquiries WHERE client_hash=? AND created_at>?').bind(hash, now - 3600000).first<{count:number}>();
    if ((rate?.count || 0) >= 5) return json({ error: 'Too many requests. Please try again later.' }, 429);
    const photos = [];
    for (const {file,mime} of checked) { const photoId = crypto.randomUUID(), key = `inquiries/${id}/${photoId}`; keys.push(key); await BUCKET.put(key, await file.arrayBuffer(), { httpMetadata: {contentType:mime} }); photos.push({id:photoId,key,mime,name:file.name.replace(/[^\p{L}\p{N}._ -]/gu,'_').slice(0,100),bytes:file.size}); }
    const statements = [DB.prepare('INSERT INTO inquiries (id,created_at,name,email,phone,cemetery,town,memorial_name,service,style,notes,language,client_hash,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,now,name,email,field('phone',50),field('cemetery',200),field('town',150),field('memorialName',150),service,style,field('message',3000),field('language',5)==='sr'?'sr':'en',hash,'new')];
    for (const photo of photos) statements.push(DB.prepare('INSERT INTO inquiry_photos (id,inquiry_id,object_key,filename,mime,bytes) VALUES (?,?,?,?,?,?)').bind(photo.id,id,photo.key,photo.name,photo.mime,photo.bytes));
    await DB.batch(statements); return json({ ok:true, reference:id, photoCount:photos.length },201);
  } catch (error) { for (const key of keys) try { await BUCKET.delete(key); } catch {} console.error('Preview enquiry storage failed', error instanceof Error ? error.message : 'Unknown'); return json({ error:'Unable to save your request. Your details are still in the form; please try again.' },503); }
}
