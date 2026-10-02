# Site Cary Sabores — publicação no Netlify

Depois de publicado, o site funciona sozinho: a Cary altera preços, produtos e fotos pelo próprio site, sem precisar de programador.

## Publicar (uma vez só)
1. Crie uma conta gratuita em github.com e um repositório novo (ex.: `cary-sabores`).
2. No repositório, clique em **Add file > Upload files** e envie TODO o conteúdo desta pasta (mantendo as pastas `public` e `netlify`, o `netlify.toml` e o `package.json`).
3. Em netlify.com: **Add new site > Import an existing project > GitHub** e escolha o repositório. Não precisa mudar nenhuma configuração.
4. Antes do primeiro deploy (ou depois, e então use **Deploys > Trigger deploy**), vá em **Site configuration > Environment variables** e crie:
   - Nome: `ADMIN_PASSWORD`
   - Valor: a senha inicial do painel (escolha uma boa, com 8+ caracteres)
5. Abra o endereço do site, vá até o rodapé e clique em **Área administrativa**. Entre com a senha.

## Como a Cary usa
- No rodapé, **Área administrativa** > senha.
- Altere preços, sabores, massas, topos, doces e envie fotos (escolhendo a categoria).
- Clique em **Salvar alterações**. O site já mostra as mudanças para todos os clientes.
- A senha pode ser trocada no próprio painel (campo "Senha"). Depois de trocada, a variável `ADMIN_PASSWORD` deixa de ser usada. Se esquecer a senha, é possível redefini-la no painel do Netlify (apague a chave `pwhash` do armazenamento "config" em Blobs).

## Observações
- Fotos são reduzidas automaticamente (cerca de 1000px). Fotos removidas do painel são apagadas ao salvar.
- Os preços iniciais vêm do cardápio e ficam no arquivo `public/index.html` (objeto `D`); depois do primeiro "Salvar", o painel passa a valer.
- Domínio próprio (ex.: carysabores.com.br) pode ser ligado em **Domain management** no Netlify.
