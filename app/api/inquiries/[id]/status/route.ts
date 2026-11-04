import {isAdmin,json,runtime} from '../../../../../server/quotes';
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}) {
  if (!isAdmin(request)) return json({error:'Access denied.'},403);
  if (request.headers.get('origin')!==new URL(request.url).origin) return json({error:'Invalid origin.'},403);
  const {id}=await params; const data=await request.formData(); const status=String(data.get('status')||'');
  if (!['new','reviewing','quoted','closed'].includes(status)) return json({error:'Invalid status.'},400);
  const result=await runtime().DB.prepare('UPDATE inquiries SET status=? WHERE id=?').bind(status,id).run();
  if (!result.meta.changes) return json({error:'Request not found.'},404);
  return Response.redirect(new URL('/review-inbox',request.url),303);
}
