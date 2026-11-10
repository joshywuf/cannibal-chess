const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const GL={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟',H:'♞'},VAL={P:1,N:3,B:3,R:5,Q:9,K:0,H:9};
const ND=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],KD=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const sqn=i=>'abcdefgh'[i&7]+(8-(i>>3)),opp=c=>c==='w'?'b':'w';
const init=()=>{const b=Array(64).fill(null),o='RNBQKBNR';for(let c=0;c<8;c++){b[c]='b'+o[c];b[8+c]='bP';b[48+c]='wP';b[56+c]='w'+o[c]}return{b,t:'w',cr:{wK:1,wQ:1,bK:1,bQ:1},ep:-1}};
function gen(S,i,att){const b=S.b,p=b[i],c=p[0],ty=p[1],r=i>>3,f=i&7,out=[];
 const add=(rr,ff)=>{if(rr<0||rr>7||ff<0||ff>7)return false;const j=rr*8+ff,q=b[j];if(!q){out.push({from:i,to:j});return true}if(q[1]==='K'&&q[0]===c)return false;out.push({from:i,to:j,cap:1});return false};
 if(ty==='N'||ty==='H')ND.forEach(([a,d])=>add(r+a,f+d));
 else if(ty==='K'){KD.forEach(([a,d])=>add(r+a,f+d));if(!att)for(let k=out.length;k--;)if(out[k].cap&&b[out[k].to][0]===c)out.splice(k,1);const h=c==='w'?56:0,o=opp(c);
  if(!att&&i===h+4&&!attacked(S,i,o)){
   if(S.cr[c+'K']&&!b[h+5]&&!b[h+6]&&b[h+7]===c+'R'&&!attacked(S,h+5,o)&&!attacked(S,h+6,o))out.push({from:i,to:h+6,castle:'K'});
   if(S.cr[c+'Q']&&!b[h+3]&&!b[h+2]&&!b[h+1]&&b[h]===c+'R'&&!attacked(S,h+3,o)&&!attacked(S,h+2,o))out.push({from:i,to:h+2,castle:'Q'})}}
 else if(ty==='P'){const d=c==='w'?-1:1,st=c==='w'?6:1;
  for(const df of[-1,1]){const rr=r+d,ff=f+df;if(rr<0||rr>7||ff<0||ff>7)continue;const j=rr*8+ff,q=b[j];
   if(att)out.push({from:i,to:j});else if(q&&!(q[1]==='K'&&q[0]===c))out.push({from:i,to:j,cap:1});else if(!q&&j===S.ep)out.push({from:i,to:j,cap:1,ep:1})}
  if(!att&&!b[i+d*8]){out.push({from:i,to:i+d*8});if(r===st&&!b[i+d*16])out.push({from:i,to:i+d*16,dbl:1})}}
 else{const ds=ty==='R'?KD.slice(0,4):ty==='B'?KD.slice(4):KD;ds.forEach(([a,d])=>{let rr=r+a,ff=f+d;while(add(rr,ff)){rr+=a;ff+=d}})}
 return out}
function attacked(S,sq,by){for(let j=0;j<64;j++){const p=S.b[j];if(p&&p[0]===by&&gen(S,j,1).some(m=>m.to===sq))return true}return false}
function apply(S,m){const b=S.b.slice(),p=b[m.from],c=p[0],cr={...S.cr};let ep=-1;
 b[m.to]=p;b[m.from]=null;if(m.ep)b[m.to+(c==='w'?8:-8)]=null;
 if(m.castle){const h=c==='w'?56:0;if(m.castle==='K'){b[h+5]=b[h+7];b[h+7]=null}else{b[h+3]=b[h];b[h]=null}}
 if(p[1]==='P'&&(m.to>>3===0||m.to>>3===7))b[m.to]=c+'Q';
 if(p[1]==='H')b[m.to]=c+'Q';
 if(m.dbl)ep=(m.from+m.to)/2;
 if(p[1]==='K')cr[c+'K']=cr[c+'Q']=0;
 [[56,'wQ'],[63,'wK'],[0,'bQ'],[7,'bK']].forEach(([s,k])=>{if(m.from===s||m.to===s)cr[k]=0});
 return{b,t:opp(c),cr,ep}}
const legal=(S,i)=>gen(S,i).filter(m=>{const N=apply(S,m);return!attacked(N,N.b.indexOf(S.t+'K'),N.t)});
const allLegal=S=>{const o=[];S.b.forEach((p,i)=>{if(p&&p[0]===S.t)o.push(...legal(S,i))});return o};
const inCheck=S=>attacked(S,S.b.indexOf(S.t+'K'),opp(S.t));
const isSelf=(S,m)=>m.cap&&S.b[m.to]&&S.b[m.to][0]===S.b[m.from][0];
function san(S,m,N){let s;const p=S.b[m.from];
 if(m.castle)s=m.castle==='K'?'O-O':'O-O-O';
 else s=(p[1]==='P'?(m.cap?'abcdefgh'[m.from&7]:''):p[1]==='H'?'Qn':p[1])+(m.cap?(isSelf(S,m)?'⊗':'x'):'')+sqn(m.to);
 if(inCheck(N))s+=allLegal(N).length?'+':'#';return s}
const mat=(S,c)=>S.b.reduce((a,p)=>p?a+(p[0]===c?1:-1)*VAL[p[1]]:a,0);
const CH={lexi:{n:'Lexi',lvl:1},rober:{n:'Rober',lvl:2},arthur:{n:'Arthur',lvl:3}};
const AB={lexi:{n:'King Leap',full:1,g:'♚',d:'Jump your king to any empty, safe square. Uses your turn.'},rober:{n:'Double Jump',full:2,g:'♞',d:'Move one knight twice in a row in the same turn.'},arthur:{n:'Horse Form',full:Infinity,g:'♛',d:'Turn your queen into a knight for one move, then she is a queen again. Unlimited.'}};
const ORDER=['lexi','rober','arthur'];
let pname='',prog={};
try{pname=localStorage.getItem('cc-name')||'';prog=JSON.parse(localStorage.getItem('cc-prog')||'{}')}catch(e){}
const saveP=()=>{try{localStorage.setItem('cc-prog',JSON.stringify(prog));localStorage.setItem('cc-name',pname)}catch(e){}};
const esc=t=>t.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const isH=(S,c)=>S.b.includes(c+'H');
const tog=S=>{const c=S.t,b=S.b.slice(),i=b.findIndex(p=>p===c+'Q'||p===c+'H');if(i<0)return null;b[i]=b[i][1]==='Q'?c+'H':c+'Q';return{...S,b}};
const mid=(S,m)=>({...apply(S,m),t:S.t,ep:-1});
function leapT(S){const c=S.t,k=S.b.indexOf(c+'K'),o=[];S.b.forEach((p,j)=>{if(p)return;const b=S.b.slice();b[j]=c+'K';b[k]=null;if(!attacked({...S,b},j,opp(c)))o.push({from:k,to:j,leap:1})});return o}
/* ----- computer ----- */
const cen=(S,c)=>S.b.reduce((a,p,i)=>p&&p[1]!=='K'?a+(p[0]===c?1:-1)*(3.5-Math.max(Math.abs((i>>3)-3.5),Math.abs((i&7)-3.5))):a,0);
const ev=(S,c,lv)=>mat(S,c)+(lv>2?cen(S,c)*.06:0);
function sc(N,me,lv){const rs=allLegal(N);if(!rs.length)return inCheck(N)?1000:0;return Math.min(...rs.map(r=>ev(apply(N,r),me,lv)))}
function pick(S,lv,flt){let ms=allLegal(S);if(flt)ms=ms.filter(flt);if(!ms.length)return{m:null,s:-1e9};
 if(lv===1){const ok=ms.filter(m=>!isSelf(S,m)),pool=Math.random()<.9&&ok.length?ok:ms;return{m:pool[Math.random()*pool.length|0],s:-5}}
 let best=null,bs=-1e9;for(const m of ms){const s=sc(apply(S,m),S.t,lv)+Math.random()*.4;if(s>bs){bs=s;best=m}}return{m:best,s:bs}}
function bestDJ(S,lv,bs){let best=null,b=-1e9;for(const m1 of allLegal(S)){if(S.b[m1.from][1]!=='N')continue;const N1=mid(S,m1);
 for(const m2 of legal(N1,m1.to)){const s=sc(apply(N1,m2),S.t,lv)+Math.random()*.4;if(s>b){b=s;best={m1,m2}}}}return best&&b>=bs+1.5?best:null}
function aiGo(){if(!g||g.over)return;const S=g.S,a=g.ab.b[0],lv=CH[g.ch].lvl;
 if(a.id==='lexi'&&a.u>0&&inCheck(S)&&Math.random()<.85){const t=leapT(S);if(t.length)return leap(t[Math.random()*t.length|0])}
 const best=pick(S,lv);
 if(a.id==='rober'&&a.u>0){const dj=bestDJ(S,lv,best.s);if(dj){g.aiNext=dj.m2;return jump1(dj.m1)}}
 if(a.id==='arthur'){const S2=tog(S);if(S2){const h=pick(S2,lv,x=>S2.b[x.from][1]==='H');if(h.m&&h.s>best.s+.5){g.S=S2;useAb('b','arthur');draw();fxQ('b');return setTimeout(()=>play(h.m),500)}}}
 play(best.m)}
function maybeAI(){if(g.over||g.mode!=='cpu'||g.S.t===g.me)return;g.busy=true;draw();setTimeout(aiGo,450)}
let PFX=null;
function fxPiece(i,k,from){const sq=$(`.sq[data-i="${i}"]`);if(!sq)return;
 const h=document.createElement('span');h.className='halo k-'+k;sq.appendChild(h);setTimeout(()=>h.remove(),1100);
 const p=sq.querySelector('.pc');
 if(p){p.classList.remove('fx-'+k);void p.offsetWidth;p.classList.add('fx-'+k);setTimeout(()=>p.classList.remove('fx-'+k),1000)}
 if(k==='lexi'){const b=$('#board');b.classList.remove('shake');void b.offsetWidth;b.classList.add('shake');setTimeout(()=>b.classList.remove('shake'),500)}
 if(k==='rober'&&p&&from!=null){const o=$(`.sq[data-i="${from}"]`);if(o){const gh=document.createElement('span');gh.className='ghost '+p.className;gh.textContent=p.textContent;o.appendChild(gh);setTimeout(()=>gh.remove(),800)}}}
function fxQ(c){const i=g.S.b.findIndex(p=>p&&p[0]===c&&(p[1]==='Q'||p[1]==='H'));if(i>=0&&cfg.anim!=='off')fxPiece(i,'arthur')}
/* ----- game flow ----- */
let g=null;
const cp=()=>({w:g.ab.w.map(a=>({...a})),b:g.ab.b.map(a=>({...a}))});
function start(ch){const cpu=!!ch;
 g={S:init(),hist:[],mv:[],mode:cpu?'cpu':'pass',ch,me:'w',flip:false,sel:null,tg:[],last:null,over:null,busy:false,arm:null,pend:null,ab:{w:[],b:[]}};
 if(cpu){const id=ch;g.ab.b=[{id,u:AB[id].full}];ORDER.forEach(k=>{const st=prog[k];if(st&&k!==ch)g.ab.w.push({id:k,u:st==='harvest'?AB[k].full:1,ally:st==='spare'})})}
 g.t0={S:g.S,ab:cp()};$('#ov').className='ov';show('game');draw();sfx('start');maybeAI()}
function abHTML(){if(g.mode!=='cpu')return'';
 const row=c=>g.ab[c].map(a=>{const d=AB[a.id],inf=a.u===Infinity,h=isH(g.S,c),full=a.ally?1:d.full;
  const pips=inf?`<span class="pip on">${h?'♞':'♛'}&#xFE0E;</span><span class="inf">∞ ${h?'horse':'queen'} form</span>`:Array.from({length:full},(_,k)=>`<span class="pip${k<a.u?' on':''}">${d.g}&#xFE0E;</span>`).join('')+`<span class="inf">${a.u} left</span>`;
  const mine=c===g.me&&!g.over,act=g.arm&&g.arm.id===a.id;
  const lab=g.pend&&a.id==='rober'?'Skip 2nd jump':act?'Cancel':a.id==='arthur'?(h?'Back to queen':'Queen → horse'):'Use';
  return `<div class="ab${g.pulse===c+a.id?' pulse':''}"><div class="who">${c===g.me?esc(pname):CH[g.ch].n}</div><div class="pips">${pips}</div><div class="nm">${d.n}${a.ally?' (ally help)':''}</div><div class="ds">${d.d}</div>`
  +(mine?`<button class="ab-b" data-a="${a.id}"${(a.u<1&&!g.pend)||g.S.t!==c||g.busy?' disabled':''}>${lab}</button>`:'')+'</div>'}).join('');
 return row('b')+row('w')}
function draw(){const S=g.S,bd=$('#board'),chk=inCheck(S)?S.b.indexOf(S.t+'K'):-1;let h='';
 for(let d=0;d<64;d++){const i=g.flip?63-d:d,p=S.b[i],lt=((i>>3)+(i&7))%2===0,m=g.tg.find(x=>x.to===i);
  h+=`<div class="sq ${lt?'l':'d'}${cfg.hl&&g.last&&(g.last.from===i||g.last.to===i)?' last':''}${g.sel===i?' sel':''}${i===chk?' chk':''}" data-i="${i}">`
  +(cfg.coord&&d%8===0?`<em class="r">${8-(i>>3)}</em>`:'')+(cfg.coord&&d>=56?`<em class="f">${'abcdefgh'[i&7]}</em>`:'')
  +(p?`<i class="pc ${p[0]}${p[1]==='H'?' h':''}">${GL[p[1]]}&#xFE0E;</i>`:'')
  +(m&&cfg.legal?`<span class="mk ${m.leap?'l':!m.cap?'m':isSelf(S,m)?'s':'c'}"></span>`:'')+'</div>'}
 bd.innerHTML=h;
 const top=g.flip?'w':'b',bot=opp(top),cpu=g.mode==='cpu',nm=c=>cpu?(c===g.me?esc(pname):CH[g.ch].n+' · Lv '+CH[g.ch].lvl):(c==='w'?'White':'Black');
 const pb=c=>`<div class="av">${cpu&&c!==g.me?AB[g.ch].g:c==='w'?'♔':'♚'}&#xFE0E;</div><div>${nm(c)}<br><small>${c==='w'?'White':'Black'}</small></div>`;
 $('#pTop').innerHTML=pb(top);$('#pBot').innerHTML=pb(bot);
 $('#pTop').className='pb'+(!g.over&&S.t===top?' turn':'');$('#pBot').className='pb'+(!g.over&&S.t===bot?' turn':'');
 $('#stat').textContent=g.over||(g.pend?'Jump again, or skip':g.arm?(g.arm.id==='lexi'?'Pick a gold dot for your king':'Pick a knight'):(S.t==='w'?'White':'Black')+' to move'+(chk>=0?' · check':''));
 let mh='';g.mv.forEach((s,k)=>{mh+=(k%2?'':`<span class="n">${k/2+1}.</span>`)+`<span>${s}</span>`});
 $('#mv').innerHTML=mh;$('#mv').scrollTop=1e5;
 $('#abp').innerHTML=abHTML();$('#abp').style.display=cpu?'':'none';
 $('#ov').className='ov'+(g.over?' on':'')}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),1800)}
function useAb(c,id){const a=g.ab[c].find(x=>x.id===id);if(a&&a.u!==Infinity)a.u--;g.pulse=c+id;toast((c===g.me&&g.mode==='cpu'?pname:CH[g.ch].n)+' used '+AB[id].n+'!');sfx('power')}
function fin(N,s,m,self){const c=g.S.t;g.busy=false;g.hist.push(g.t0);
 if(!/[+#]$/.test(s)&&inCheck(N))s+=allLegal(N).length?'+':'#';
 g.mv.push(s);g.S=N;g.last=m||g.last;g.sel=null;g.tg=[];g.arm=null;g.pend=null;
 if(!allLegal(N).length)g.over=inCheck(N)?(c==='w'?'White':'Black')+' wins by checkmate':'Draw by stalemate';
 if(cfg.aflip&&g.mode==='pass')g.flip=N.t==='b';
 g.t0={S:N,ab:cp()};
 draw();anim(m,self);sfx(g.over?'end':inCheck(N)?'check':m&&m.castle?'castle':self?'self':m&&m.cap?'cap':'move');
 if(g.over)result();else maybeAI()}
function play(m){const S=g.S,N=apply(S,m);fin(N,san(S,m,N),m,isSelf(S,m))}
function leap(m){const S=g.S,c=S.t,b=S.b.slice();b[m.to]=b[m.from];b[m.from]=null;
 const N={b,t:opp(c),cr:{...S.cr,[c+'K']:0,[c+'Q']:0},ep:-1};PFX='lexi';useAb(c,'lexi');fin(N,'K★'+sqn(m.to),m,false)}
function jump1(m){const S=g.S,c=S.t,N=mid(S,m),self=isSelf(S,m);
 g.pend={s:san(S,m,{...N,t:opp(c)}),self};g.S=N;g.last=m;g.sel=m.to;g.tg=legal(N,m.to);g.arm={id:'rober'};
 useAb(c,'rober');draw();PFX='rober';anim(m,self);sfx(self?'self':m.cap?'cap':'move');
 if(!g.tg.length)return setTimeout(()=>jump2(null),500);
 if(g.mode==='cpu'&&c!==g.me)setTimeout(()=>jump2(g.aiNext),650)}
function jump2(m){const S=g.S,c=S.t,p=g.pend;let N,s=p.s+'★';
 if(m){N=apply(S,m);s+=san(S,m,N)}else{N={...S,t:opp(c),ep:-1};s+='–'}
 PFX='rober';fin(N,s,m,m?isSelf(S,m):p.self)}
function result(){let b;const win=g.mode==='cpu'&&g.over.includes('White wins by checkmate');
 if(win){const k=g.ch,n=CH[k].n;$('#ovT').textContent=`You defeated ${n}!`;$('#ovS').textContent=`${AB[k].n}: ${AB[k].d}`;
  b=`<button class="btn" data-o="harvest">Harvest ${n}’s power</button><button class="btn sec" data-o="spare">Spare ${n}</button>`}
 else{$('#ovT').textContent=g.over;$('#ovS').textContent='';b='<button class="btn" data-o="re">Rematch</button><button class="btn sec" data-o="menu">Menu</button>'}
 $('#ovB').innerHTML=b;$('#ov').className='ov on'}
$('#ovB').onclick=e=>{const o=e.target.dataset.o;if(!o)return;
 if(o==='re')return start(g.ch||null);if(o==='menu')return show('home');if(o==='next')return start(g.nx);
 const k=g.ch,n=CH[k].n;prog[k]=o;saveP();g.nx=ORDER[ORDER.indexOf(k)+1];
 $('#ovT').textContent=o==='harvest'?`${n} is gone. You took ${AB[k].n}.`:`You spared ${n}. They may help you later.`;
 $('#ovS').textContent=o==='harvest'?'Use it from the ability panel beside the board.':'In your next games you can call on their move once.';
 $('#ovB').innerHTML=(g.nx?`<button class="btn" data-o="next">Face ${CH[g.nx].n}</button>`:'')+'<button class="btn sec" data-o="menu">Menu</button>';sfx(o==='harvest'?'end':'start')};
$('#board').onclick=e=>{const q=e.target.closest('.sq');if(!q||g.over||g.busy)return;const i=+q.dataset.i,S=g.S;if(g.mode==='cpu'&&S.t!==g.me)return;
 const m=g.tg.find(x=>x.to===i);
 if(m){if(m.leap)return leap(m);if(g.pend)return jump2(m);if(g.arm&&g.arm.id==='rober')return jump1(m);return play(m)}
 if(g.pend||(g.arm&&g.arm.id==='lexi'))return;
 const p=S.b[i];if(p&&p[0]===S.t&&(!g.arm||p[1]==='N')){g.sel=i;g.tg=legal(S,i)}else{g.sel=null;g.tg=[]}draw()};
$('#abp').onclick=e=>{const b=e.target.closest('button');if(!b||b.disabled||g.over||g.busy)return;const id=b.dataset.a,S=g.S,c=S.t;
 if(g.pend)return jump2(null);
 if(g.arm){g.arm=null;g.sel=null;g.tg=[];return draw()}
 if(id==='arthur'){const T=tog(S);if(T){const was=isH(S,c);g.S=T;if(!was)useAb(c,'arthur');g.sel=null;g.tg=[];draw();fxQ(c)}return draw()}
 g.arm={id};g.sel=null;g.tg=id==='lexi'?leapT(S):[];draw()};
$('#undo').onclick=()=>{if(g.busy)return;
 const rs=(S,ab)=>{g.S=S;g.ab={w:ab.w.map(a=>({...a})),b:ab.b.map(a=>({...a}))}};
 if(g.pend||g.arm||g.S!==g.t0.S){rs(g.t0.S,g.t0.ab);g.pend=g.arm=null;g.sel=null;g.tg=[];return draw()}
 if(!g.hist.length)return;const n=g.mode==='cpu'&&g.S.t===g.me&&g.hist.length>1?2:1;
 for(let k=0;k<n&&g.hist.length;k++){const[S,ab]=g.hist.pop();rs(S,ab);g.mv.pop()}
 g.over=null;g.last=null;g.t0={S:g.S,ab:cp()};g.sel=null;g.tg=[];draw();maybeAI()};
$('#flip').onclick=()=>{g.flip=!g.flip;draw()};
$('#res').onclick=()=>{if(g.over)return;const b=$('#res');if(cfg.confirm&&b.dataset.arm!=='1'){b.dataset.arm='1';b.textContent='Sure?';setTimeout(()=>{b.dataset.arm='';b.textContent='Resign'},3000);return}
 b.dataset.arm='';b.textContent='Resign';const l=g.mode==='cpu'?g.me:g.S.t;g.over=(l==='w'?'Black':'White')+' wins by resignation';draw();sfx('end');result()};
$('#nw2').onclick=()=>show('home');
/* ----- menus ----- */
function show(v){$$('.view').forEach(x=>x.classList.toggle('on',x.id===v));$$('nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v||(v==='game'&&b.dataset.v==='home')));if(v==='home')renderHome()}
$$('nav button').forEach(b=>b.onclick=()=>show(b.dataset.v));
function renderHome(){$('#wn').textContent=pname;
 $('#opps').innerHTML=ORDER.map((k,i)=>{const c=CH[k],a=AB[k],st=prog[k],lock=i>0&&!prog[ORDER[i-1]],dead=st==='harvest';
  return `<button class="opp${lock||dead?' lock':''}" data-k="${k}"${lock||dead?' disabled':''}><span class="av">${a.g}&#xFE0E;</span><span><b>${c.n}</b> · Level ${c.lvl}<br><small>${a.n}: ${a.d}</small></span><em>${dead?'Harvested':lock?'Locked':st==='spare'?'Spared · replay':'Play'}</em></button>`}).join('')}
$('#opps').onclick=e=>{const b=e.target.closest('button');if(b&&!b.disabled)start(b.dataset.k)};
$('#friend').onclick=()=>start(null);
function openName(){$('#ni').value=pname;$('#nm').classList.add('on');setTimeout(()=>$('#ni').focus(),50)}
$('#chg').onclick=openName;
$('#nk').onclick=()=>{const v=$('#ni').value.trim();if(!v)return $('#ni').focus();pname=v.slice(0,16);saveP();$('#nm').classList.remove('on');renderHome()};
$('#ni').onkeydown=e=>{if(e.key==='Enter')$('#nk').click()};
(()=>{const S=init(),pv=$('#prev');let h='';S.b.forEach((p,i)=>{h+=`<div class="sq ${((i>>3)+(i&7))%2===0?'l':'d'}" style="cursor:default">${p?`<i class="pc ${p[0]}">${GL[p[1]]}&#xFE0E;</i>`:''}</div>`});pv.innerHTML=h})();
renderHome();if(!pname)openName();
/* ---------- settings, animation, sound ---------- */
const THEMES={teal:['#e8eadb','#5f8a8b','Teal'],green:['#eeeed2','#769656','Green'],brown:['#f0d9b5','#b58863','Brown'],slate:['#dee3e6','#8ca2ad','Slate']};
const SET=[['sound','Sound','t'],['anim','Piece animation','s',[['off','Off'],['fast','Fast'],['normal','Normal']]],['legal','Show legal moves','t'],['hl','Highlight last move','t'],['coord','Show coordinates','t'],['theme','Board color','s',Object.entries(THEMES).map(([k,v])=>[k,v[2]])],['confirm','Confirm before resigning','t'],['aflip','Flip board each turn (friend mode)','t']];
let cfg={sound:1,anim:matchMedia('(prefers-reduced-motion: reduce)').matches?'off':'normal',legal:1,hl:1,coord:1,theme:'teal',confirm:1,aflip:0};
try{Object.assign(cfg,JSON.parse(localStorage.getItem('cc-cfg')||'{}'))}catch(e){}
function applyCfg(){const t=THEMES[cfg.theme]||THEMES.teal,r=document.documentElement.style;r.setProperty('--lt',t[0]);r.setProperty('--dk',t[1]);try{localStorage.setItem('cc-cfg',JSON.stringify(cfg))}catch(e){}}
function renderSet(){$('#sb').innerHTML=SET.map(([k,l,ty,o])=>ty==='t'?`<div class="row"><span>${l}</span><button class="sw${cfg[k]?' on':''}" data-k="${k}" role="switch" aria-checked="${!!cfg[k]}" aria-label="${l}"></button></div>`:`<div class="row col"><span>${l}</span><div class="seg" style="margin:0">${o.map(([v,n])=>`<button data-k="${k}" data-v="${v}"${cfg[k]===v?' class="on"':''}>${n}</button>`).join('')}</div></div>`).join('')}
$('#sb').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.k;cfg[k]=b.dataset.v!==undefined?b.dataset.v:+!cfg[k];applyCfg();renderSet();if(g)draw();if(k==='sound'&&cfg.sound)sfx('move')};
const sm=$('#sm'),closeSet=()=>sm.classList.remove('on');
$('#setBtn').onclick=$('#gear').onclick=()=>{renderSet();sm.classList.add('on')};
$('#sx').onclick=closeSet;sm.onclick=e=>{if(e.target===sm)closeSet()};
addEventListener('keydown',e=>{if(e.key==='Escape')closeSet()});
applyCfg();
function anim(m,self){const k=PFX;PFX=null;if(k&&m&&cfg.anim!=='off')fxPiece(m.to,k,m.from);if(!m||cfg.anim==='off')return;const dur=cfg.anim==='fast'?300:520;
 const mv=(f,t)=>{const a=$(`.sq[data-i="${f}"]`),b=$(`.sq[data-i="${t}"]`),p=b&&b.querySelector('.pc');if(!a||!p)return;
  const ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();
  p.style.transition='none';p.style.transform=`translate(${ra.left-rb.left}px,${ra.top-rb.top}px)`;p.style.zIndex=9;p.getBoundingClientRect();
  p.style.transition=`transform ${dur}ms cubic-bezier(.2,.8,.3,1)`;p.style.transform='none'};
 mv(m.from,m.to);if(m.castle){const h=m.to>>3===7?56:0;m.castle==='K'?mv(h+7,h+5):mv(h,h+3)}
 if(self){const d=$(`.sq[data-i="${m.to}"]`);d&&d.classList.add('flash')}}
let AC,NB;
function tone(f,d,ty,v,t0,f2){const t=AC.currentTime+(t0||0),o=AC.createOscillator(),gn=AC.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(gn);gn.connect(AC.destination);o.start(t);o.stop(t+d+.02)}
function noise(d,v,fc){const t=AC.currentTime,s=AC.createBufferSource(),f=AC.createBiquadFilter(),gn=AC.createGain();
 if(!NB){NB=AC.createBuffer(1,AC.sampleRate*.3,AC.sampleRate);const a=NB.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1}
 s.buffer=NB;f.type='bandpass';f.frequency.value=fc;gn.gain.setValueAtTime(v,t);gn.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(f);f.connect(gn);gn.connect(AC.destination);s.start(t);s.stop(t+d)}
const SFX={power:()=>{tone(300,.35,'sawtooth',.12,0,900);tone(600,.3,'sine',.12,.1,1200)},move:()=>{noise(.05,.7,1400);tone(190,.07,'triangle',.35,0,90)},cap:()=>{noise(.1,1,900);tone(140,.14,'triangle',.5,0,55)},self:()=>{noise(.14,.9,500);tone(320,.3,'sawtooth',.18,0,60)},
 check:()=>{SFX.move();tone(880,.12,'square',.07,.06);tone(660,.18,'square',.07,.16)},castle:()=>{SFX.move();setTimeout(SFX.move,120)},
 start:()=>{tone(440,.12,'sine',.2);tone(660,.2,'sine',.2,.1)},end:()=>{[523,392,262].forEach((f,i)=>tone(f,.45,'sine',.25,i*.15))}};
function sfx(k){if(!cfg.sound)return;try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();SFX[k]()}catch(e){}}
