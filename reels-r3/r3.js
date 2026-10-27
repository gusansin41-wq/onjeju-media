const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const cl=(x,a=0,b=1)=>Math.min(Math.max(x,a),b);
const E=t=>1-Math.pow(1-cl(t),3);
const P=(t,a,d)=>cl((t-a)/d);
const S=window.SPEC,N=S.name,L=S.L;
const st=i=>L[i].a, en=i=>L[i].b;
function show(id,on){$(id).style.visibility=on?'visible':'hidden'}
function lineAt(t){let k=-1;for(let i=0;i<L.length;i++){if(t>=L[i].a-0.08)k=i}return k}
// caption
const EMPH={C1:['메뉴판','폰','샤오홍슈','DM'],C2:['0명','1만 명','한 명','계정 크기'],C3:['없는 가게','두 곳'],
 K1:['첫 장면','업종'],K2:['200','외관','먹는 장면','저장'],K3:['누르지 마세요','지역','나이','DM'],
 P1:['몇 번째','늦은','댓글'],P2:['별점','석 달 전','문 닫은 줄','진단 신청'],P3:['1등','9등','30미터','저장']};
function capHTML(s){let h=s.replace(/&/g,'&amp;').replace(/</g,'&lt;');for(const w of (EMPH[N]||[]))h=h.split(w).join('<b>'+w+'</b>');return h}
function caption(t){const c=$('#cap');const k=lineAt(t);if(k<0){c.style.opacity=0;return}
 const txt=L[k].cap||L[k].tts;
 if(c.dataset.k!=k){c.dataset.k=k;if(S.capStyle==='kr'){c.innerHTML=txt.split('\n').map(x=>'<span class="box">'+capHTML(x)+'</span>').join('<br>')}else c.innerHTML=capHTML(txt)}
 const p=E(P(t,L[k].a-0.08,.2));c.style.opacity=p;c.style.transform=`translateY(${(1-p)*24}px) scale(${.96+.04*p})`}
function tag(t,a,text,bg,fg){const g=$('#tag');g.textContent=text;g.style.background=bg;g.style.color=fg;const p=E(P(t,a,.35));g.style.opacity=p;g.style.transform=`translateX(-50%) translateY(${(1-p)*30}px)`}
// stock frames with ping-pong + slow zoom
const imgCache={};
function frame(el,dir,max,t,zoom=1.06){const fpsi=Math.floor(t*30)%(2*max-2);const f=(fpsi<max?fpsi:2*max-2-fpsi)+1;const src=dir+'/'+String(f).padStart(3,'0')+'.jpg';if(el.getAttribute('src')!==src)el.setAttribute('src',src);
 if(zoom)el.style.transform=`scale(${zoom+0.05*t/S.dur})`}
window.waitImg=()=>Promise.all($$('img').map(i=>i.complete?1:new Promise(r=>{i.onload=i.onerror=r})));
// ---------- per reel ----------
const R={};
R.C1=t=>{show('#Lstock',1);frame($('#stock'),S.foot,S.footmax,t);
 // phone pops up on lines 3-4 showing feed
 const on=t>=st(2)-.1&&t<en(4)+.2;show('#Lphone',on);
 if(on){const p=E(P(t,st(2)-.1,.35));$('.phone').style.transform=`translateY(${(1-p)*700}px) scale(.72)`;$('.phone').style.transformOrigin='50% 10%';
   $('.cns .feed').style.opacity=t<st(4)?1:0;$('.cns .empty').style.opacity=t>=st(4)?1:0}
 if(t>=st(5))tag(t,st(5),'DM → 동네 이름만','#FFD43B','#111');};
R.C2=t=>{show('#Lsolid',1);$('#Lsolid').style.background='#0b0b0d';show('#Lphone',1);
 const ex=$('.calc .expr'),rs=$('.calc .res'),nt=$('.calc .note');
 let e='',r='0',n='';
 if(t>=st(0)){e='체험단';r='500,000';n='→ 손님 0명'}
 if(t>=st(2)){e='2,000 × 5';r=t>=st(2)+1.4?'10,000':'2,000';n='팔로워 합계'}
 if(t>=st(3)){e='10,000 − 겹치는 사람';r='< 10,000';n='실제 도달은 더 적음'}
 if(t>=st(4)){e='10,000 × 1';r='10,000';n='같은 돈이면'}
 if(t>=st(5)){e='';r='?';n='계약 전 계정 크기 확인'}
 ex.textContent=e;rs.textContent=r;nt.textContent=n;
 // key press flash
 $$('.calc .k').forEach((k,i)=>k.classList.toggle('p',Math.floor(t*6)%17===i&&t>st(1)&&t<en(4)));
 if(t>=st(6))tag(t,st(6),'궁금하면 DM','#ff9f0a','#111');};
R.C3=t=>{show('#Lsolid',1);$('#Lsolid').style.background='#000';
 const big=$('#big');const k=lineAt(t);$('#cap').style.display='none';
 const ph=t>=st(1)-.1&&t<en(1)+.2;show('#Lphone',ph);
 if(ph){const p=E(P(t,st(1)-.1,.35));$('.phone').style.transform=`scale(${.9+.1*p})`;$('.phone').style.opacity=p}
 if(k<0||ph){big.style.opacity=ph?0:0;if(ph){big.style.top='1330px';big.style.fontSize='64px';big.textContent=L[1].cap||L[1].tts;big.style.opacity=E(P(t,st(1)+.3,.3))}return}
 big.style.fontSize='92px';big.style.top='700px';
 // typewriter
 const txt=(L[k].cap||L[k].tts);const n=Math.floor(cl((t-st(k))/(Math.max(en(k)-st(k),.6)*.7))*txt.length);
 big.textContent=txt.slice(0,Math.max(n,1));big.style.opacity=1;
 if(k===3){big.style.color='#FFD43B'}else big.style.color='#fff';
 if(t>=st(2))tag(t,st(2),'프로필 링크 → 우리 동네 자리','#fff','#111');};
R.K1=t=>{show('#Lsplit',1);frame($('#sl'),S.foot,S.footmax,t,0);frame($('#sr'),S.foot2,S.footmax2,t+1.2,0);
 const k=lineAt(t);const pulse=k===2?(.5+.5*Math.sin(t*8)):0;$$('.lab').forEach(l=>l.style.transform=`scale(${1+.06*pulse})`);
 if(t>=st(4))tag(t,st(4),'댓글: 업종만','#ff5a1f','#fff');};
R.K2=t=>{show('#Lsolid',1);$('#Lsolid').style.background='#1a1a1a';show('#Lphone',1);
 const seq=[[st(0)+.2,'me'],[st(1),'w'],[st(1)+.5,'you'],[st(2)-.2,'me2'],[st(2)+.8,'you2']];
 const b=$$('.bub'),w=$$('.who');
 const shows=[t>=st(0)+.2,t>=st(1)+.9,t>=st(2)-.1,t>=st(3)];
 b.forEach((x,i)=>{const p=shows[i]?E(P(t,[st(0)+.2,st(1)+.9,st(2)-.1,st(3)][i],.25)):0;x.style.opacity=p;x.style.transform=`translateY(${(1-p)*20}px)`});
 w.forEach((x,i)=>{x.style.opacity=b[[1,3][i]].style.opacity});
 const ty=$('.typing');ty.style.opacity=(t>=st(1)&&t<st(1)+.9)?1:0;$$('.typing i').forEach((d,i)=>d.style.transform=`translateY(${-8*Math.max(0,Math.sin(t*9-i))}px)`);
 if(t>=st(5))tag(t,st(5),'저장해두고 다음 촬영 때','#fee500','#111');};
R.K3=t=>{show('#Lsolid',1);$('#Lsolid').style.background='#0e1116';show('#Lphone',1);
 const f=$('.finger');const s=$('.stop');
 // finger approaches button then stops
 const ap=E(P(t,0,1.1));f.style.left=(520-120*ap)+'px';f.style.top=(1250-280*ap)+'px';f.style.opacity=t<st(1)?1:0;
 const sp=E(P(t,st(0)+.25,.25));s.style.opacity=t<st(1)?sp:0;s.style.transform=`translate(-50%,-50%) rotate(-8deg) scale(${1.4-.4*sp})`;
 const chg=t>=st(2)+.3;$$('.boost .v').forEach(v=>v.innerHTML=chg?v.dataset.b:v.dataset.a);
 $$('.boost .row').forEach((r,i)=>r.style.background=(t>=st(1)&&t<st(2)&&i<2)?'#fff3f3':(chg&&i<2?'#eef6ff':'#fff'));
 if(t>=st(3))tag(t,st(3),'설정 화면 캡처 → DM','#0a7cff','#fff');};
R.P1=t=>{show('#Lsolid',1);$('#Lsolid').style.background='#2b3a2f';show('#Lphone',1);
 const q='애월 흑돼지';const n=Math.floor(cl((t-st(1))/1.4)*q.length);$('.map .q').textContent=t>=st(1)?q.slice(0,n):'';
 const list=$('.map .list');const lp=E(P(t,st(1)+1.6,.4));list.style.opacity=lp;
 // scroll during line 3
 const sc=E(P(t,st(3),1.6));list.style.transform=`translateY(${-sc*760}px)`;
 $('.map .it.me').style.opacity=t>=st(3)+.6?1:0;
 if(t>=st(4))tag(t,st(4),'댓글: 몇 위였는지','#19b35c','#fff');};
R.P2=t=>{show('#Lsolid',1);$('#Lsolid').style.background='#20262b';show('#Lphone',1);
 const sc=E(P(t,st(1),1.2));$('.rev .body').style.transform=`translateY(${-sc*120}px)`;
 $$('.rev .dt').forEach(d=>d.classList.toggle('hot',t>=st(2)));$$('.rev .rp').forEach(d=>d.classList.toggle('none',t>=st(1)+.8));
 if(t>=st(4))tag(t,st(4),'프로필 링크 → 진단 신청','#5BE08B','#111');};
R.P3=t=>{show('#Lstock',1);frame($('#stock'),S.foot,S.footmax,t);show('#Lpins',1);
 const a=E(P(t,st(0)+.1,.3)),b=E(P(t,st(0)+1.0,.3));$('#pin1').style.opacity=a;$('#pin1').style.transform=`translate(-50%,-100%) translateY(${(1-a)*-60}px)`;
 $('#pin9').style.opacity=b;$('#pin9').style.transform=`translate(-50%,-100%) translateY(${(1-b)*-60}px)`;
 $('#dist').style.opacity=t>=st(1)&&t<en(1)+.3?1:0;
 if(t>=st(4))tag(t,st(4),'저장 → 다음 편','#5BE08B','#111');};
// ---------- build phone screens ----------
const SCR={
C1:`<div class="scr cns"><div class="bar">济州 美食<i></i></div><div class="tabs"><b>综合</b><span>最热</span><span>最新</span></div>
 <div class="feed"><div class="card"></div><div class="card"></div><div class="card"></div><div class="card"></div></div>
 <div class="empty" style="opacity:0"><div class="ic">?</div>우리 가게는<br>안 보여요</div></div>`,
C2:`<div class="scr calc"><div class="disp"><div class="expr"></div><div class="res">0</div><div class="note"></div></div>
 <div class="keys">${['AC','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+'].map((k,i)=>`<div class="k ${i<3?'l':''} ${i%4===3?'o':''}">${k}</div>`).join('')}</div></div>`,
C3:`<div class="scr cns"><div class="bar">济州 黑猪肉 餐厅<i></i></div><div class="tabs"><b>综合</b><span>用户</span><span>商品</span></div>
 <div class="empty"><div class="ic">∅</div>没有找到相关内容<br><span style="font-size:32px;color:#bbb">(관련 결과 없음)</span></div></div>`,
K2:`<div class="scr chat"><div class="top">‹ 동네 친구</div><div class="msgs">
 <div class="bub me">릴스 올렸는데<br>조회수 200 나옴 ㅠ</div>
 <div class="who">친구</div><div class="typing"><i></i><i></i><i></i></div>
 <div class="bub you">뭐 찍었는데?</div>
 <div class="bub me">가게 외관부터 쭉…</div>
 <div class="who">친구</div>
 <div class="bub you">아… 😅</div></div></div>`,
K3:`<div class="scr boost"><div class="hd">게시물 홍보하기</div>
 <div class="row">타겟 <b class="v" data-a="자동 (넓게)" data-b='<b class="chg">제주시 · 반경 5km</b>'></b></div>
 <div class="row">연령 <b class="v" data-a="18–65+" data-b='<b class="chg">25–54</b>'></b></div>
 <div class="row">일 예산 <b>₩10,000</b></div><div class="row">기간 <b>7일</b></div>
 <div class="btn">홍보하기</div><div class="finger"></div><div class="stop">STOP</div></div>`,
P1:`<div class="scr map"><div class="sb"><span class="q"></span><i></i></div><div class="list">
 ${[1,2,3,4,5,6,7,8].map(i=>`<div class="it ${i===8?'me':''}"><div class="th"></div><div><div class="nm">${i===8?'우리 가게':'○○ 식당 '+i}</div><div class="sub">${i===8?'여기까지 내려야 보여요':'리뷰 · 사진 · 저장'}</div></div><div class="rk">${i}</div></div>`).join('')}
 </div></div>`,
P2:`<div class="scr rev"><div class="hd">방문자 리뷰</div><div class="body">
 ${[['3개월 전','친절하고 맛있었어요. 다음에 또 올게요.'],['4개월 전','양이 많아요. 주차는 조금 불편해요.'],['5개월 전','분위기 좋고 메뉴가 다양해요.'],['6개월 전','가족이랑 가기 좋아요.']].map(([d,x])=>`<div class="r"><div class="u"><div class="av"></div><div class="nmb"></div><div class="dt">${d}</div></div><div class="tx">${x}</div><div class="rp">사장님 답글 없음</div></div>`).join('')}
 </div></div>`,
};
(function init(){if(SCR[N])$('#scr').outerHTML=SCR[N];if(S.example)$('#ex').style.display='block';$('#cap').className=S.capStyle+(N==='C3'?' mid':'');})();
window.render=t=>{$$('.layer').forEach(l=>l.style.visibility='hidden');R[N](t);if(N!=='C3')caption(t)};
