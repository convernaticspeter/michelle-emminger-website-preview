import fs from 'node:fs';
import path from 'node:path';
const dist='dist';
const pages=[];
function walk(d){ for(const f of fs.readdirSync(d)){ const p=path.join(d,f); if(fs.statSync(p).isDirectory()) walk(p); else if(f==='index.html') pages.push(p); }}
walk(dist);
let ok=true;
for(const p of pages){ const html=fs.readFileSync(p,'utf8'); const rel=p.replace(dist,'');
 if(!/<h1[\s>]/.test(html)){ console.error('missing h1',rel); ok=false; }
 if(!/<meta name="description" content=".{40,}"/.test(html)){ console.error('weak meta desc',rel); ok=false; }
 const imgs=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
 for(const src of imgs){ if(src.startsWith('/assets/') && !fs.existsSync(path.join('dist',src))){ console.error('broken img',rel,src); ok=false; }}
}
console.log(`QA pages=${pages.length} ok=${ok}`);
process.exit(ok?0:1);
