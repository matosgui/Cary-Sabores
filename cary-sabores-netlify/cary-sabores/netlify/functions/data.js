import { getStore } from '@netlify/blobs';
import { okPw, hashPw, cfg } from '../lib/auth.js';
export const config = { path: '/api/data' };
const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });
export default async (req) => {
  const site = getStore({ name: 'site', consistency: 'strong' });
  if (req.method === 'GET') {
    const d = await site.get('data', { type: 'text' });
    const js = 'window.__D=' + (d ? d.replace(/</g, '\\u003c') : 'null') + ';';
    return new Response(js, { headers: { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'no-store' } });
  }
  if (req.method !== 'POST') return J({ error: 'Método inválido' }, 405);
  let b;
  try { b = await req.json(); } catch { return J({ error: 'Pedido inválido' }, 400); }
  if (!(await okPw(b.password))) return J({ error: 'Senha incorreta.' }, 401);
  if (b.action === 'login') return J({});
  if (b.action === 'save') {
    const d = b.data;
    if (!d || typeof d !== 'object' || !Array.isArray(d.coberturas) || !Array.isArray(d.massas) || !Array.isArray(d.recheios)) return J({ error: 'Dados inválidos.' }, 400);
    const txt = JSON.stringify(d);
    if (txt.length > 900000) return J({ error: 'Dados grandes demais.' }, 413);
    if (b.newPassword !== undefined && String(b.newPassword).length < 6) return J({ error: 'A nova senha precisa ter pelo menos 6 caracteres.' }, 400);
    await site.set('data', txt);
    if (b.newPassword) await cfg().set('pwhash', hashPw(String(b.newPassword)));
    const fotos = getStore({ name: 'fotos', consistency: 'strong' });
    const { blobs } = await fotos.list();
    for (const x of blobs) if (!txt.includes(x.key)) await fotos.delete(x.key);
    return J({});
  }
  return J({ error: 'Ação inválida' }, 400);
};
