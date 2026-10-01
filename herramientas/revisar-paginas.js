// Abre TODAS las páginas del curso en Chrome y reporta errores de JavaScript
// o archivos que no cargan. Úsalo antes y después de publicar.
//
//   cd herramientas && npm install          (solo la primera vez)
//   node revisar-paginas.js                 → revisa tu copia local
//   node revisar-paginas.js https://rogeliovargas.com/code-quest/   → el sitio publicado
//
// Usa el Google Chrome instalado en la Mac (no descarga otro navegador).
const { chromium } = require('playwright-core');
const { spawn } = require('child_process');
const glob = require('fs');
const path = require('path');
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
function listar(dir, base = '') {
  let r = [];
  for (const f of glob.readdirSync(path.join(dir, base))) {
    const rel = path.join(base, f);
    if (f.startsWith('.') || ['CodeQuest-para-compartir', 'node_modules', 'herramientas'].includes(f)) continue;
    if (glob.statSync(path.join(dir, rel)).isDirectory()) r = r.concat(listar(dir, rel));
    else if (f.endsWith('.html')) r.push(rel);
  }
  return r;
}
(async () => {
  const dir = path.join(__dirname, '..');
  let base = process.argv[2];
  let srv = null;
  if (!base) {
    srv = spawn('python3', ['-m', 'http.server', '8812', '--bind', '127.0.0.1'], { cwd: dir, stdio: 'ignore' });
    await new Promise(r => setTimeout(r, 800));
    base = 'http://localhost:8812/';
  }
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const ctx = await browser.newContext();
  const paginas = listar(dir).filter(p => !p.includes('plantilla'));
  let malas = 0;
  for (const p of paginas) {
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', e => errs.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/favicon|Failed to load resource/.test(m.text())) errs.push('console: ' + m.text()); });
    page.on('response', r => { if (r.status() >= 400 && !/favicon|placecats|picsum/.test(r.url())) errs.push('HTTP ' + r.status() + ' ' + r.url()); });
    try {
      await page.goto(base + p, { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(1200);
      const ok = await page.evaluate(() => !!document.querySelector('.cq-header') || !!window.CodeQuest || document.title.length > 0);
      if (!ok) errs.push('sin header');
    } catch (e) { errs.push('carga: ' + e.message.split('\n')[0]); }
    if (errs.length) { malas++; console.log('❌', p, errs.slice(0, 4)); }
    await page.close();
  }
  console.log(`\n${paginas.length} páginas revisadas, ${malas} con problemas`);
  await browser.close(); if (srv) srv.kill();
  process.exit(malas ? 1 : 0);
})();
