import {isAdmin,json,runtime} from '../../../../server/quotes';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}) {
  if (!isAdmin(request)) return json({error:'Access denied.'},403);
  const {id}=await params; const {DB,BUCKET}=runtime();
  const row=await DB.prepare('SELECT object_key,mime FROM inquiry_photos WHERE id=?').bind(id).first<{object_key:string;mime:string}>();
  if (!row) return json({error:'Photo not found.'},404); const file=await BUCKET.get(row.object_key); if (!file) return json({error:'Photo not found.'},404);
  return new Response(file.body,{headers:{'Content-Type':row.mime,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'none'; sandbox"}});
}
