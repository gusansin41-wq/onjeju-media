const { chromium } = require('playwright');const fs=require('fs');
const [,,name,dur,mode]=process.argv;
(async()=>{const b=await chromium.launch();const q=await b.newPage({viewport:{width:1080,height:1920}});
q.on('pageerror',e=>console.error('PAGEERR',e.message));
await q.goto('file://'+process.cwd()+'/r3.html');await q.waitForTimeout(800);
const out='out/'+name+(mode?'_t':'');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
let times;
if(mode){const L=await q.evaluate(()=>SPEC.L.map(l=>[l.a,l.b]));times=L.map(([a,b])=>a+(b-a)*.75);}
else times=[...Array(Math.round(dur*30)).keys()].map(i=>i/30);
let i=0;for(const t of times){await q.evaluate(t=>render(t),t);await q.evaluate(()=>waitImg());
await q.screenshot({path:`${out}/f${String(i++).padStart(4,'0')}.jpg`,type:'jpeg',quality:88});}
await b.close();})();
