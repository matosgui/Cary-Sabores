import { getStore } from '@netlify/blobs';
import { okPw } from '../lib/auth.js';
export const config = { path: '/api/foto' };
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });
export default async (req) => {
  const s = getStore({ name: 'fotos', consistency: 'strong' });
  if (req.method === 'GET') {
    const id = new URL(req.url).searchParams.get('id');
    const data = id ? await s.get(id, { type: 'arrayBuffer' }) : null;
    if (!data) return new Response('Não encontrada', { status: 404 });
    return new Response(data, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable' } });
  }
  if (req.method === 'POST') {
    if (!(await okPw(req.headers.get('x-admin-password')))) return J({ error: 'Senha incorreta.' }, 401);
    const buf = await req.arrayBuffer();
    if (!buf.byteLength || buf.byteLength > 3000000) return J({ error: 'Imagem inválida ou grande demais.' }, 400);
    const id = crypto.randomUUID();
    await s.set(id, buf);
    return J({ src: '/api/foto?id=' + id });
  }
  return J({ error: 'Método inválido' }, 405);
};
