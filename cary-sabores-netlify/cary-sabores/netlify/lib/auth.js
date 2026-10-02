import { getStore } from '@netlify/blobs';
import { createHash } from 'node:crypto';
export const hashPw = (s) => createHash('sha256').update('cary-sabores:' + s).digest('hex');
export const cfg = () => getStore({ name: 'config', consistency: 'strong' });
/* Senha: a que foi trocada pelo painel (se houver) ou a variável ADMIN_PASSWORD do Netlify. */
export async function okPw(pw) {
  if (!pw || typeof pw !== 'string') return false;
  const stored = await cfg().get('pwhash');
  const good = stored ? hashPw(pw) === stored : !!process.env.ADMIN_PASSWORD && pw === process.env.ADMIN_PASSWORD;
  if (!good) await new Promise((r) => setTimeout(r, 1000));
  return good;
}
