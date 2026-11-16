
const $=id=>document.getElementById(id),fr=(n,d)=>`<span class="fr"><i>${n}</i><i>${d}</i></span>`;
const F=(v,d=4)=>v.toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
const L='Fase 2: se activará con su representación ';
// ---- Catálogo: lógica matemática (f explícita para las curvas de la Fase 1) ----
const C=[
{n:'Circunferencia',cat:'Cónicas',type:'implícita (se gira su semicircunferencia superior)',eq:'x² + y² = R²',ok:1,P:[['R','R',.5,5,2,.1]],f:(x,p)=>Math.sqrt(Math.max(0,p.R*p.R-x*x)),dom:p=>[-p.R,p.R],def:p=>[-p.R,p.R],tip:'Con límites [−R, R] y eje X se obtiene una esfera.'},
{n:'Elipse',cat:'Cónicas',type:'implícita (semielipse superior)',eq:`${fr('x²','a²')} + ${fr('y²','b²')} = 1`,ok:1,P:[['A','a',.5,5,3,.1],['B','b',.5,5,1.5,.1]],f:(x,p)=>p.B*Math.sqrt(Math.max(0,1-x*x/(p.A*p.A))),dom:p=>[-p.A,p.A],def:p=>[-p.A,p.A],tip:'Girar la región alrededor de un eje principal genera un elipsoide.'},
{n:'Parábola',cat:'Cónicas',type:'explícita',eq:'y = k·x²',ok:1,P:[['k','k',.1,3,1,.05]],f:(x,p)=>p.k*x*x,dom:()=>[-5,5],def:()=>[0,2],tip:'La región bajo la parábola girada sobre el eje X genera un paraboloide.'},
{n:'Hipérbola',cat:'Cónicas',type:'implícita',eq:`${fr('x²','a²')} − ${fr('y²','b²')} = 1`,note:L+'(una rama delimitada por una recta vertical).'},
{n:'Sinusoidal',cat:'Funciones',type:'explícita',eq:'y = A·sen(ωx + φ)',ok:1,P:[['A','A',.2,3,1,.1],['w','ω',.2,4,1,.1],['ph','φ',-3.14,3.14,0,.05]],f:(x,p)=>p.A*Math.sin(p.w*x+p.ph),dom:()=>[-10,10],def:()=>[0,3.14],tip:'Gira solo tramos donde la curva no cruza la línea base.'},
{n:'Exponencial',cat:'Funciones',type:'explícita',eq:'y = A·e<sup>kx</sup>',ok:1,P:[['A','A',.1,3,1,.1],['k','k',-2,2,.5,.05]],f:(x,p)=>p.A*Math.exp(p.k*x),dom:()=>[-4,4],def:()=>[0,2],tip:'Con intervalo acotado el volumen es finito.'},
{n:'Logarítmica',cat:'Funciones',type:'explícita, x > 0',eq:'y = s·ln(x)',ok:1,P:[['s','s',.2,3,1,.1]],f:(x,p)=>p.s*Math.log(x),dom:()=>[.05,10],def:()=>[1,5],tip:'Solo se puede girar donde ln(x) ≥ línea base (x ≥ 1 si c = 0).'},
{n:'Logística',cat:'Funciones',type:'explícita',eq:`y = ${fr('1','1 + e<sup>−kx</sup>')}`,ok:1,P:[['k','k',.2,4,1,.1]],f:(x,p)=>1/(1+Math.exp(-p.k*x)),dom:()=>[-8,8],def:()=>[-4,4],tip:'Tiende a 1: el sólido se estabiliza a un cilindro.'},
{n:'Gaussiana',cat:'Funciones',type:'explícita',eq:'y = A·e<sup>−s x²</sup>',ok:1,P:[['A','A',.2,3,1,.1],['s','s',.1,3,1,.1]],f:(x,p)=>p.A*Math.exp(-p.s*x*x),dom:()=>[-4,4],def:()=>[-2,2],tip:'Eje X: forma de campana 3D. Eje Y: usa límites con a ≥ 0.'},
{n:'Catenaria',cat:'Funciones',type:'explícita',eq:`y = a·cosh(${fr('x','a')})`,ok:1,P:[['a','a',.5,4,1.5,.1]],f:(x,p)=>p.a*Math.cosh(x/p.a),dom:()=>[-4,4],def:()=>[-2,2],tip:'Girada sobre el eje X genera el catenoide.'},
{n:'Espiral de Arquímedes',cat:'Espirales',type:'polar',eq:'r = a + bθ',note:L+'paramétrica.'},
{n:'Espiral logarítmica',cat:'Espirales',type:'polar',eq:'r = a·e<sup>bθ</sup>',note:L+'paramétrica.'},
{n:'Cicloide',cat:'Paramétricas',type:'paramétrica',eq:'x = R(t − sen t), y = R(1 − cos t)',note:L+'paramétrica (el arco 0 ≤ t ≤ 2π delimita una región).'},
{n:'Clotoide',cat:'Paramétricas',type:'paramétrica numérica',eq:'κ(s) = c·s',note:L+'numérica (integrales de Fresnel).'},
{n:'Curva de Bézier',cat:'Paramétricas',type:'paramétrica',eq:'B(t), 4 puntos de control',note:L+'con puntos de control arrastrables.'},
{n:'Hélice circular',cat:'Paramétricas',type:'curva espacial',eq:'x = R cos t, y = R sen t, z = ct',note:'Fase 2: es una curva espacial, no una superficie de revolución; se trabajarán sus proyecciones.'},
{n:'Lissajous',cat:'Paramétricas',type:'paramétrica',eq:'x = A sen(at + δ), y = B sen(bt)',note:L+'paramétrica.'},
{n:'Evolvente del círculo',cat:'Paramétricas',type:'paramétrica',eq:'x = R(cos t + t sen t), y = R(sen t − t cos t)',note:L+'paramétrica.'}
];
C.forEach((c,i)=>c.i=i+1);
const NS='Curva que no es una gráfica y = f(x): al girarla se obtiene una superficie abierta. Para calcular un volumen habría que delimitar una región cerrada.';
Object.assign(C[3],{ok:1,P:[['A','a',.5,4,1.5,.1],['B','b',.5,4,1,.1]],f:(x,p)=>p.B*Math.sqrt(Math.max(0,x*x/(p.A*p.A)-1)),dom:p=>[p.A,8],def:p=>[p.A,p.A+2],tip:'Se gira un tramo de la rama derecha (x ≥ a) delimitado por una recta vertical.'});
Object.assign(C[10],{ok:1,bd:'Superficie',P:[['r0','a',0,3,.5,.1],['k','b',.05,1,.3,.05]],g:(t,p)=>{const r=p.r0+p.k*t;return[r*Math.cos(t),r*Math.sin(t)]},dom:()=>[0,20],def:()=>[0,12.5],noSolid:NS,tip:'Parámetro θ en radianes. La separación entre vueltas es constante (2π·b).'});
Object.assign(C[11],{ok:1,bd:'Superficie',P:[['r0','a',.1,2,.5,.05],['k','b',.02,.4,.15,.01]],g:(t,p)=>{const r=p.r0*Math.exp(p.k*t);return[r*Math.cos(t),r*Math.sin(t)]},dom:()=>[0,25],def:()=>[0,12.5],noSolid:NS,tip:'Parámetro θ en radianes. Conserva el ángulo entre la tangente y el radio.'});
Object.assign(C[12],{ok:1,bd:'Mixto',P:[['R','R',.5,3,1,.1]],g:(t,p)=>[p.R*(t-Math.sin(t)),p.R*(1-Math.cos(t))],dom:()=>[0,12.57],def:()=>[0,6.28],tip:'Un arco completo (0 ≤ t ≤ 2π) girado sobre el eje X da un sólido de volumen finito.'});
Object.assign(C[13],{ok:1,bd:'Mixto',P:[['q','c',.2,3,1,.1]],g:(t,p)=>{const n=2*Math.ceil(t*20+1),k=p.q/2;return[simpson(u=>Math.cos(k*u*u),0,t,n),simpson(u=>Math.sin(k*u*u),0,t,n)]},dom:()=>[0,5],def:()=>[0,1.7],tip:'Curva numérica (integrales de Fresnel). El tramo inicial es una gráfica; más allá, x deja de crecer y solo hay superficie.'});
Object.assign(C[14],{ok:1,bd:'Mixto',P:[['x1','x₁',0,4,1,.1],['y1','y₁',0,4,2,.1],['x2','x₂',0,4,2.5,.1],['y2','y₂',0,4,2,.1]],g:(t,p)=>{const u=1-t,w1=3*u*u*t,w2=3*u*t*t,w3=t*t*t;return[w1*p.x1+w2*p.x2+4*w3,w1*p.y1+w2*p.y2+w3]},dom:()=>[0,1],def:()=>[0,1],tip:'Bézier cúbica con P₀ = (0; 0) y P₃ = (4; 1) fijos. Mueve P₁ y P₂ con los controles. Si x crece, hay sólido.'});
Object.assign(C[15],{ok:1,bd:'Superficie',P:[['R','R',.5,3,1.5,.1],['h','paso',.1,1,.3,.05]],g:(t,p)=>[p.h*t,p.R*Math.cos(t)],h3:(t,p,ax)=>ax==='x'?[p.h*t,p.R*Math.cos(t),p.R*Math.sin(t)]:[p.R*Math.cos(t),p.h*t,p.R*Math.sin(t)],dom:()=>[0,37.7],def:()=>[0,18.85],noSolid:'La hélice (verde en 3D) es una curva espacial, no una superficie de revolución. Aquí se gira su perfil lateral (naranja), que genera solo una superficie.',tip:'x = R cos t, y = R sen t, z = h·t. La hélice se enrolla alrededor del eje elegido.'});
Object.assign(C[16],{ok:1,bd:'Superficie',P:[['A','A',.5,4,3,.1],['B','B',.5,4,2,.1],['fa','a',1,6,3,1],['fb','b',1,6,2,1],['d','δ',0,3.14,1.57,.05]],g:(t,p)=>[p.A*Math.sin(p.fa*t+p.d),p.B*Math.sin(p.fb*t)],dom:()=>[0,6.28],def:()=>[0,6.28],noSolid:'Curva cerrada que se cruza a sí misma y cruza los ejes: al girarla se obtiene una superficie que puede autointersecarse, no un sólido.',tip:'Combina dos oscilaciones perpendiculares. Cambia frecuencias y desfase.'});
Object.assign(C[17],{ok:1,bd:'Mixto',P:[['R','R',.5,3,1,.1]],g:(t,p)=>[p.R*(Math.cos(t)+t*Math.sin(t)),p.R*(Math.sin(t)-t*Math.cos(t))],dom:()=>[0,12.57],def:()=>[0,1.5],tip:'Para 0 ≤ t ≤ π/2 la curva es una gráfica y genera sólido; después x retrocede y solo hay superficie.'});
// ---- Estado ----
let cur,P={},S={a:0,b:1,c:0,axis:'x'},ang=360,play=false,speed=1,err=null,mesh,prof,hel,cap,VT,drag=0,mode='solid',warn='';
// ---- Cálculo integral (numérico, sin inventar primitivas) ----
function simpson(g,a,b,n=2000){const h=(b-a)/n;let s=g(a)+g(b);for(let i=1;i<n;i++)s+=g(a+i*h)*(i%2?4:2);return s*h/3}
const f=x=>cur.f(x,P);
function samp(n){const{a,b}=S,o=[];for(let i=0;i<=n;i++){const t=a+(b-a)*i/n;if(cur.g){const q=cur.g(t,P);o.push({x:q[0],y:q[1]})}else o.push({x:t,y:f(t)})}return o}
function validate2(){mode='solid';warn='';if(!cur.g)return validate();
 const{a,b,c,axis}=S;if(!(a<b-1e-6))return 'El parámetro inicial debe ser menor que el final. Modifica el intervalo para continuar.';
 const p=samp(300);if(p.some(q=>!isFinite(q.x)||!isFinite(q.y)))return 'El intervalo seleccionado no pertenece al dominio de la curva.';
 const mono=p.every((q,i)=>!i||q.x>=p[i-1].x-1e-9),up=p.every(q=>q.y>=c-1e-9),pos=p.every(q=>q.x>=-1e-9);
 if(cur.noSolid||!mono||!up||(axis==='y'&&!pos)){mode='surface';warn=cur.noSolid||'La curva genera una superficie abierta, no un sólido cerrado. Para obtener volumen, x debe crecer a lo largo del tramo, la curva debe quedar sobre la base y = c y, al girar sobre Y se necesita x ≥ 0. Acorta el intervalo.'}
 return null}
function volume(){const{a,b,c,axis}=S;if(cur.g){const p=samp(4000);let s=0;for(let i=1;i<p.length;i++){const u=p[i-1],w=p[i],dx=w.x-u.x;s+=axis==='x'?((u.y*u.y+w.y*w.y)/2-c*c)*dx:(u.x+w.x)/2*((u.y+w.y)/2-c)*dx}return(axis==='x'?1:2)*Math.PI*s}return axis==='x'?Math.PI*simpson(x=>f(x)**2-c*c,a,b):2*Math.PI*simpson(x=>x*(f(x)-c),a,b)}
function validate(){
 if(!cur.ok)return cur.note;const{a,b,c,axis}=S;
 if(!(a<b-1e-6))return 'El límite inferior debe ser menor que el superior. Modifica los límites de integración para continuar.';
 if(axis==='y'&&a<0)return 'Para girar alrededor del eje Y con capas cilíndricas la región debe estar en x ≥ 0. Lleva el límite inferior a un valor ≥ 0.';
 let mn=1e9;for(let i=0;i<=300;i++){const y=f(a+(b-a)*i/300);if(!isFinite(y))return 'El intervalo seleccionado no pertenece al dominio de la función.';mn=Math.min(mn,y)}
 if(mn<c-1e-9)return 'La región no está completamente delimitada: la curva queda por debajo de la línea base y = c. Cambia c o el intervalo.';
 return null}
// ---- Geometría: frontera de la región (curva + rectas) revolucionada con fórmulas reales ----
function profile(){const{c}=S,pts=samp(120).map(q=>[q.x,q.y]);if(mode==='surface')return pts;const a=pts[0][0],b=pts[pts.length-1][0],fa=pts[0][1];
 pts.push([b,c],[a,c],[a,fa]);return pts}
function revolve(pr,axis,th,M){const N=pr.length,pos=[],idx=[];
 for(let j=0;j<=M;j++){const t=th*j/M,c=Math.cos(t),s=Math.sin(t);for(const[x,y]of pr)axis==='x'?pos.push(x,y*c,y*s):pos.push(x*c,y,x*s)}
 for(let j=0;j<M;j++)for(let i=0;i<N-1;i++){const a=j*N+i,b=a+1,c=a+N,d=c+1;idx.push(a,b,c,b,d,c)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
// ---- Gráfica 2D ----
function draw2D(){
 const cv=$('c2'),r=cv.getBoundingClientRect(),d=devicePixelRatio||1;cv.width=r.width*d;cv.height=r.height*d;
 const g=cv.getContext('2d');g.setTransform(d,0,0,d,0,0);const W=r.width,H=r.height;g.clearRect(0,0,W,H);g.font='12px system-ui';
 if(!cur.ok){g.fillStyle='#8fa3d1';g.fillText('Vista 2D disponible en la Fase 2',16,40);return}
 const{a,b,c,axis}=S,pts=[];let ys=[0,c],xs=[0];
 samp(160).forEach(q=>{if(isFinite(q.x)&&isFinite(q.y)){pts.push([q.x,q.y]);ys.push(q.y);xs.push(q.x)}});
 let x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 if(x1-x0<1){x1+=.5;x0-=.5}if(y1-y0<1){y1+=.5;y0-=.5}
 const px=(x1-x0)*.12,py=(y1-y0)*.12;x0-=px;x1+=px;y0-=py;y1+=py;
 const sc=Math.min((W-30)/(x1-x0),(H-30)/(y1-y0)),ox=W/2-sc*(x0+x1)/2,oy=H/2+sc*(y0+y1)/2,X=x=>ox+sc*x,Y=y=>oy-sc*y;VT={sc,ox,oy};
 g.strokeStyle='#14264f';g.lineWidth=1;for(let x=Math.ceil(x0);x<=x1;x++){g.beginPath();g.moveTo(X(x),0);g.lineTo(X(x),H);g.stroke()}
 for(let y=Math.ceil(y0);y<=y1;y++){g.beginPath();g.moveTo(0,Y(y));g.lineTo(W,Y(y));g.stroke()}
 const ax=(vert,on)=>{g.strokeStyle=on?'#fb923c':'#5b6f9f';g.lineWidth=on?3:1.5;g.beginPath();vert?(g.moveTo(X(0),0),g.lineTo(X(0),H)):(g.moveTo(0,Y(0)),g.lineTo(W,Y(0)));g.stroke()};
 ax(false,axis==='x');ax(true,axis==='y');g.fillStyle='#8fa3d1';g.fillText('x',W-14,Y(0)-6);g.fillText('y',X(0)+6,12);
 if(a<b&&pts.length>2){g.beginPath();if(mode==='solid'){g.moveTo(X(pts[0][0]),Y(c));pts.forEach(p=>g.lineTo(X(p[0]),Y(p[1])));g.lineTo(X(pts[pts.length-1][0]),Y(c));g.closePath();g.fillStyle='rgba(34,211,238,.25)';g.fill();g.beginPath()}
  g.beginPath();pts.forEach((p,i)=>i?g.lineTo(X(p[0]),Y(p[1])):g.moveTo(X(p[0]),Y(p[1])));g.strokeStyle='#a3e635';g.lineWidth=2.5;g.stroke()}
 g.fillStyle='#fb923c';g.fillText('Eje de rotación: eje '+axis.toUpperCase(),10,r.height-8);if(cur.i===15)[[P.x1,P.y1],[P.x2,P.y2]].forEach(q=>{g.beginPath();g.arc(X(q[0]),Y(q[1]),6,0,6.3);g.fillStyle='#fb923c';g.fill()})}
// ---- Escena 3D ----
let R,scene,cam,ctl,grid;
function init3D(){
 if(typeof THREE==='undefined'||!THREE.OrbitControls){$('c3').innerHTML='<p class="mu" style="padding:30px">No se pudo cargar Three.js. Revisa tu conexión; la gráfica 2D y los cálculos siguen funcionando.</p>';return}
 R=new THREE.WebGLRenderer({antialias:true,alpha:true});$('c3').appendChild(R.domElement);
 scene=new THREE.Scene();cam=new THREE.PerspectiveCamera(45,1,.1,500);ctl=new THREE.OrbitControls(cam,R.domElement);ctl.enableDamping=true;
 scene.add(new THREE.AmbientLight(0xffffff,.6));const dl=new THREE.DirectionalLight(0xffffff,.9);dl.position.set(5,8,6);scene.add(dl);
 grid=new THREE.GridHelper(40,40,0x2f7bff,0x1c2f63);scene.add(grid);scene.add(new THREE.AxesHelper(8));resize();
 (function loop(t){requestAnimationFrame(loop);
  if(play){ang=Math.min(360,ang+speed*60*(t-(loop.l||t))/1000);$('an').value=ang;$('anv').textContent=Math.round(ang)+'°';if(ang>=360){play=false;$('pl').textContent='▶ Iniciar'}build3D()}
  loop.l=t;ctl.update();R.render(scene,cam)})(0)}
function resize(){if(!R)return;const e=$('c3');R.setSize(e.clientWidth,e.clientHeight);cam.aspect=e.clientWidth/e.clientHeight;cam.updateProjectionMatrix();draw2D()}
function build3D(fit){
 if(!R)return;if(mesh){scene.remove(mesh);mesh.geometry.dispose();mesh=null}if(prof){scene.remove(prof);prof=null}if(hel){scene.remove(hel);hel=null}if(cap){scene.remove(cap);cap=null}
 if(err||!cur.ok)return;const pr=profile(),th=ang*Math.PI/180;
 mesh=new THREE.Mesh(revolve(pr,S.axis,th,Math.max(2,Math.ceil(96*th/6.2832))),new THREE.MeshStandardMaterial({color:0x22d3ee,side:THREE.DoubleSide,transparent:true,opacity:$('op').value/100,wireframe:$('wf').checked,roughness:.5}));scene.add(mesh);cutIt(pr);
 if($('gp').checked){prof=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pr.map(p=>new THREE.Vector3(p[0],p[1],0))),new THREE.LineBasicMaterial({color:0xfb923c}));scene.add(prof)}
 if(cur.h3){const hp=[];for(let i=0;i<=300;i++)hp.push(new THREE.Vector3(...cur.h3(S.a+(S.b-S.a)*i/300,P,S.axis)));hel=new THREE.Line(new THREE.BufferGeometry().setFromPoints(hp),new THREE.LineBasicMaterial({color:0xa3e635}));scene.add(hel)}
 if(fit){const xs=pr.map(p=>p[0]),ys=pr.map(p=>p[1]),x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
  const rad=S.axis==='x'?Math.max(Math.abs(y0),Math.abs(y1)):Math.max(Math.abs(x0),Math.abs(x1)),ax=S.axis==='x'?x1-x0:y1-y0,e=Math.max(rad,ax/2,.5);
  const ct=S.axis==='x'?[(x0+x1)/2,0,0]:[0,(y0+y1)/2,0];ctl.target.set(...ct);cam.position.set(ct[0]+e*2.6,ct[1]+e*1.8,ct[2]+e*3);grid.position.y=Math.min(y0,-rad)-.01;ctl.update()}}
// ---- Interfaz ----
function catalog(){const q=$('q').value.toLowerCase();let h='',last='';
 C.forEach((c,k)=>{if(!c.n.toLowerCase().includes(q))return;if(c.cat!==last){h+=`<div class="cat">${c.cat}</div>`;last=c.cat}
  h+=`<button class="it ${c===cur?'on':''}" data-k="${k}"><i>${String(c.i).padStart(2,'0')}</i>${c.n}<span class="bd ${c.ok?'ok':''}">${c.bd||'Sólido'}</span></button>`});
 $('cat').innerHTML=h||'<p class="mu">Sin resultados.</p>'}
const sl=(k,l,mn,mx,st,v)=>`<div class="row"><label>${l}</label><input type="range" data-k="${k}" min="${mn}" max="${mx}" step="${st}" value="${v}"><output id="o_${k}">${F(+v,2)}</output></div>`;
function controls(){
 let h=cur.ok?(cur.P.map(q=>sl(q[0],q[1],q[2],q[3],q[5],P[q[0]])).join('')+sl('a',cur.g?'t inicial':'límite a',...cur.dom(P),.05,S.a)+sl('b',cur.g?'t final':'límite b',...cur.dom(P),.05,S.b)+sl('c','base y = c',0,5,.1,S.c)):'<p class="mu">Selecciona una curva de la Fase 1 para ver sus parámetros.</p>';
 h+=`<div class="row"><label>Eje</label><select id="ax"><option value="x">Eje X</option><option value="y">Eje Y</option></select></div>
 <div class="row"><label>Ángulo</label><input type="range" id="an" min="0" max="360" step="1" value="${ang}"><output id="anv">${Math.round(ang)}°</output></div>
 <div class="row"><button class="b" id="pl">▶ Iniciar</button><button class="b" id="rs">⟲ Reiniciar</button><button class="b" id="vw">Vista</button></div>
 <div class="row"><label>Velocidad</label><input type="range" id="sp" min=".25" max="3" step=".25" value="${speed}"><output id="spv">${speed}×</output></div>
 <div class="row"><label>Opacidad</label><input type="range" id="op" min="20" max="100" value="70"></div>
 <div class="row"><label><input type="checkbox" id="wf"> Malla</label><label><input type="checkbox" id="gp" checked> Generatriz</label></div>
 <div class="row"><label><input type="checkbox" id="cut"> Corte</label><input type="range" id="cs" min="0" max="100" value="50"></div>`;
 $('ctl').innerHTML=h;$('ax').value=S.axis}
function info(){
 const hd=`<h3>Curva ${String(cur.i).padStart(2,'0')}</h3><b style="font-size:16px">${cur.n}</b><div class="eq">${cur.eq}</div><small>Representación: ${cur.type}</small>`;
 let h=hd+`<div id="err" style="display:${err?'block':'none'}">${err||''}</div>`;
 if(cur.ok){h+=`<p class="mu">${cur.tip}</p>`;
  if(!err&&mode==='surface')h+=`<div class="int">${warn}</div><p>Sin región cerrada no hay volumen: se muestra solo la superficie generada por la curva.</p>`;if(!err&&mode==='solid'){const{a,b,c,axis}=S,V=volume(),m=axis==='y'?'Capas cilíndricas':c>0?'Arandelas':'Discos',
   I=axis==='y'?`V = 2π ∫<sub>${F(a,2)}</sub><sup>${F(b,2)}</sup> x·(f(x) − ${F(c,2)}) dx`:c>0?`V = π ∫<sub>${F(a,2)}</sub><sup>${F(b,2)}</sup> ([f(x)]² − ${F(c,2)}²) dx`:`V = π ∫<sub>${F(a,2)}</sub><sup>${F(b,2)}</sup> [f(x)]² dx`;
   h+=`<h3>Desarrollo</h3><ol><li>${cur.g?'Curva paramétrica':'Función f(x)'}: ${cur.eq}.</li><li>Eje de rotación: eje ${axis.toUpperCase()}.</li><li>Región: entre la curva y la base y = ${F(c,2)}${cur.g?'':', '+F(a,2)+' ≤ x ≤ '+F(b,2)}.</li><li>Límites de integración (${cur.g?'parámetro t':'x'}): [${F(a,2)}; ${F(b,2)}].</li>
   <li>${axis==='y'?'Radio de cada capa: x. Altura: f(x) − c.':c>0?'Radio exterior R = f(x); radio interior r = '+F(c,2)+'.':'Radio del disco: R = f(x).'}</li><li>Método: <b>${m}</b>.</li></ol>
   <div class="int">${cur.g?I.replace(/<sub>(.*?)<[/]sub><sup>(.*?)<[/]sup>/,'<sub>x(t=$1)</sub><sup>x(t=$2)</sup>').replace(/f\(x\)/g,'y'):I}</div><small>El método depende del eje: alrededor de X las secciones son discos o arandelas; alrededor de Y, capas cilíndricas.</small>
   <p>Integración numérica (${cur.g?'regla del trapecio con 4.000 puntos de la curva, x(t) creciente':'regla de Simpson, n = 2.000'}). No se presenta primitiva exacta: el resultado es una aproximación.</p>
   <div class="res">V ≈ ${F(V)} u³</div><small>= ${F(V/Math.PI)}·π u³</small>${chk(V)}`}}
 else h+=`<p class="mu">Esta curva ya está en el catálogo, pero su construcción 3D llega en la siguiente fase.</p>`;
 $('inf').innerHTML=h}
function cutIt(pr){R.localClippingEnabled=true;if(!$('cut').checked)return;
 const ax=S.axis==='x'?0:1,v=pr.map(p=>p[ax]),lo=Math.min(...v),hi=Math.max(...v),s=lo+(hi-lo)*$('cs').value/100;
 mesh.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(ax?0:-1,ax?-1:0,0),s)];
 if(ax===0&&mode==='solid'){const cv=pr.slice(0,121);let r=0;for(let i=1;i<cv.length;i++){const u=cv[i-1],w=cv[i];if((u[0]-s)*(w[0]-s)<=0&&w[0]!==u[0]){r=u[1]+(w[1]-u[1])*(s-u[0])/(w[0]-u[0]);break}}
  cap=new THREE.Mesh(new THREE.RingGeometry(S.c,Math.max(r,S.c+1e-6),64).rotateY(Math.PI/2),new THREE.MeshBasicMaterial({color:0xfb923c,side:THREE.DoubleSide}));cap.position.x=s;scene.add(cap)}}
function chk(V){if(typeof THREE==='undefined'||!(V>0))return '';const g=revolve(profile(),S.axis,2*Math.PI,96),p=g.getAttribute('position').array,ix=g.index.array;let s=0;
 for(let i=0;i<ix.length;i+=3){const a=ix[i]*3,b=ix[i+1]*3,c=ix[i+2]*3;s+=p[a]*(p[b+1]*p[c+2]-p[b+2]*p[c+1])-p[a+1]*(p[b]*p[c+2]-p[b+2]*p[c])+p[a+2]*(p[b]*p[c+1]-p[b+1]*p[c])}
 const Vm=Math.abs(s)/6,d=Math.abs(Vm-V)/V;g.dispose();
 return `<p class=mu>Verificación con la malla 3D: V<sub>malla</sub> ≈ ${F(Vm)} u³ · diferencia ${F(d*100,2)} % ${d<.01?'✓ coincide con la integral':'⚠ revisa la configuración'}</p>`}
function refresh(fit){err=validate2();draw2D();info();build3D(fit)}
function select(k){cur=C[k];P={};(cur.P||[]).forEach(q=>P[q[0]]=q[4]);if(cur.ok){const d=cur.def(P);S.a=d[0];S.b=d[1];S.c=0}catalog();controls();bind();refresh(true)}
function bind(){
 $('ctl').querySelectorAll('input[data-k]').forEach(e=>e.oninput=()=>{const k=e.dataset.k,v=+e.value;if(k in P)P[k]=v;else S[k]=v;
  const[lo,hi]=cur.dom(P);S.a=Math.min(Math.max(S.a,lo),hi);S.b=Math.min(Math.max(S.b,lo),hi);
  ['a','b'].forEach(t=>{const el=document.querySelector(`[data-k=${t}]`);el.min=lo;el.max=hi;el.value=S[t];$('o_'+t).textContent=F(S[t],2)});$('o_'+k).textContent=F(v,2);refresh()});
 $('ax').onchange=e=>{S.axis=e.target.value;if(S.axis==='y'&&cur.ok&&S.a<0){S.a=0;const el=document.querySelector('[data-k=a]');if(el){el.value=0;$('o_a').textContent=F(0,2)}}refresh(true)};
 $('an').oninput=e=>{ang=+e.target.value;play=false;$('pl').textContent='▶ Iniciar';$('anv').textContent=ang+'°';build3D()};
 $('pl').onclick=()=>{if(err||!cur.ok)return;if(!play&&ang>=360)ang=0;play=!play;$('pl').textContent=play?'⏸ Pausa':'▶ Iniciar'};
 $('rs').onclick=()=>{play=false;ang=0;$('an').value=0;$('anv').textContent='0°';$('pl').textContent='▶ Iniciar';build3D()};
 $('vw').onclick=()=>build3D(true);
 $('sp').oninput=e=>{speed=+e.target.value;$('spv').textContent=speed+'×'};
 ['op','wf','gp','cut','cs'].forEach(id=>$(id).oninput=()=>build3D())}
$('cat').onclick=e=>{const b=e.target.closest('.it');if(b)select(+b.dataset.k)};$('q').oninput=catalog;addEventListener('resize',resize);
const T=[['¿Qué es una curva matemática?','Un conjunto de puntos que cumple una regla: una ecuación y = f(x), una relación implícita o unas ecuaciones paramétricas x(t), y(t).'],
['Superficie de revolución','Es la superficie que deja una curva al girar 360° alrededor de un eje. Solo tiene “piel”: por sí sola no encierra volumen.'],
['Sólido de revolución','Es el cuerpo que deja una región plana cerrada al girar alrededor de un eje. Tiene interior y, por tanto, volumen.'],
['Superficie frente a sólido','Girar una curva da una superficie; girar la región que ella delimita con una recta da un sólido. Por eso las espirales y la hélice solo dan superficie aquí.'],
['¿Qué significa girar alrededor de un eje?','Cada punto describe una circunferencia perpendicular al eje, con radio igual a su distancia al eje. Sobre X: (x, y cos θ, y sen θ). Sobre Y: (x cos θ, y, x sen θ).'],
['Región generatriz','La región plana cerrada que se hace girar: aquí, la comprendida entre la curva y la recta y = c, entre dos límites. Se ve sombreada en la gráfica 2D.'],
['¿Qué es un volumen?','Cuánto espacio ocupa el sólido, en unidades cúbicas. Se obtiene sumando los volúmenes de rebanadas muy delgadas.'],
['¿Cómo se relacionan las integrales con los sólidos?','Cada rebanada tiene un volumen aproximado (área × grosor). Al hacer el grosor tender a 0, la suma se convierte en una integral definida.'],
['Discos, arandelas y capas cilíndricas','Discos: rebanadas perpendiculares al eje sin hueco, V = π ∫ [R(x)]² dx. Arandelas: con hueco, V = π ∫ ([R(x)]² − [r(x)]²) dx. Capas: cilindros huecos paralelos al eje, V = 2π ∫ (radio)(altura) dx.']];
const Q=[['Al girar solo una curva (sin región) alrededor de un eje se obtiene…',['Un sólido con volumen','Una superficie','Un prisma'],1,'Una curva sola genera una superficie; el volumen exige una región cerrada.'],
['La región entre y = x² y y = 1, girada sobre el eje X, deja un hueco junto al eje. ¿Qué método sugiere?',['Discos','Arandelas','Capas cilíndricas'],1,'Hay radio exterior (1) y radio interior (x²).'],
['Una región con x ≥ 0 y altura f(x), girada sobre el eje Y, se calcula con…',['Discos','Arandelas','Capas cilíndricas'],2,'Radio de la capa x, altura f(x): V = 2π ∫ x·f(x) dx.'],
['¿Se puede mostrar un paraboloide y calcular el volumen de un cono?',['Sí, si el intervalo es el mismo','No: la integral debe corresponder a la geometría'],1,'Cada sólido tiene su propia integral; si no coincide con el modelo 3D, el resultado es incorrecto.']];
function learn(){let h=T.map(t=>`<details><summary>${t[0]}</summary><p>${t[1]}</p></details>`).join('');
 h+=`<h3>Ejemplos interactivos</h3><button class=b onclick=demo(2,0,0,2,0)>Discos</button> <button class=b onclick=demo(2,0,1,2,1)>Arandelas</button> <button class=b onclick=demo(8,1,0,2,0)>Capas</button>`;
 h+='<h3>Ejercicios</h3>'+Q.map((q,i)=>`<div class=q><p><b>${i+1}.</b> ${q[0]}</p>${q[1].map((o,j)=>`<button class=b onclick=ans(${i},${j})>${o}</button>`).join(' ')}<p class=mu id=qa${i}></p></div>`).join('');
 h+=`<div class=q><p><b>5.</b> Calcula el volumen al girar y = x² en [0; 1] sobre el eje X.</p><input id=nu placeholder='Tu respuesta, ej. 0,5'> <button class=b onclick=chkNum()>Comprobar</button><p class=mu id=qn></p></div>`;$('lc').innerHTML=h}
function ans(i,j){$('qa'+i).textContent=j===Q[i][2]?'✓ Correcto. '+Q[i][3]:'✗ Revisa la teoría e inténtalo de nuevo.'}
function chkNum(){const v=parseFloat($('nu').value.replace(',','.'));$('qn').innerHTML=Math.abs(v-Math.PI/5)<.01?`✓ Correcto: V = π ∫₀¹ x⁴ dx = ${fr('π','5')} ≈ ${F(Math.PI/5)} u³.`:'✗ Pista: V = π ∫ [f(x)]² dx con f(x) = x², es decir, π ∫ x⁴ dx entre 0 y 1.'}
function demo(k,ax,a,b,c){select(k);S.axis=ax?'y':'x';S.a=a;S.b=b;S.c=c;controls();bind();refresh(true);$('lr').hidden=true}
$('lb').onclick=()=>{learn();$('lr').hidden=false};$('lx').onclick=()=>$('lr').hidden=true;
const c2=$('c2');
c2.onpointerdown=e=>{if(cur.i!==15||!VT)return;const r=c2.getBoundingClientRect(),mx=e.clientX-r.left,my=e.clientY-r.top;[['x1','y1'],['x2','y2']].forEach((k,i)=>{if(Math.hypot(VT.ox+VT.sc*P[k[0]]-mx,VT.oy-VT.sc*P[k[1]]-my)<16)drag=i+1});if(drag)c2.setPointerCapture(e.pointerId)};
c2.onpointermove=e=>{if(!drag)return;const r=c2.getBoundingClientRect(),k=drag===1?['x1','y1']:['x2','y2'];P[k[0]]=Math.min(4,Math.max(0,+((e.clientX-r.left-VT.ox)/VT.sc).toFixed(2)));P[k[1]]=Math.min(4,Math.max(0,+((VT.oy-(e.clientY-r.top))/VT.sc).toFixed(2)));k.forEach(q=>{const el=document.querySelector('[data-k='+q+']');el.value=P[q];$('o_'+q).textContent=F(P[q],2)});refresh()};
c2.onpointerup=()=>drag=0;
cur=C[2];init3D();select(2);if(!R)draw2D();
