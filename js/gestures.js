// Control gestual. MediaPipe solo reconoce la mano (21 puntos); la geometría y el render 3D los hace la app.
const MP='https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14';
const MODEL='https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task';
let lm,gOn=false,gLast=-1,prevP=null,prevD=null,dw={el:null,t:0},cool=0;
const gs=m=>{$('gs').textContent=m};
async function gestStart(){
 $('camw').hidden=false;gs('Cargando MediaPipe…');
 try{
  const v=$('gv');v.srcObject=await CamX.get('g');await v.play();
  if(!lm){const M=await import(MP+'/+esm'),fs=await M.FilesetResolver.forVisionTasks(MP+'/wasm');
   lm=await M.HandLandmarker.createFromOptions(fs,{baseOptions:{modelAssetPath:MODEL},runningMode:'VIDEO',numHands:2})}
  gOn=true;$('gb').textContent='🖐 Gestos: activo';gs('Muestra la palma a la cámara');requestAnimationFrame(gLoop)
 }catch(e){gOff();$('camw').hidden=false;gs('No se pudo activar: '+(e.name==='NotAllowedError'?'permiso de cámara denegado.':e.message)+' La app sigue funcionando con mouse y teclado.')}}
function gOff(){gOn=false;prevP=prevD=null;$('camw').hidden=true;$('cur').style.display='none';$('gb').textContent='🖐 Control gestual';CamX.release('g')}
function gesture(h){
 const d=(a,b)=>Math.hypot(h[a].x-h[b].x,h[a].y-h[b].y),sz=d(0,9)||1;
 const ext=[[8,6],[12,10],[16,14],[20,18]].map(([t,p])=>h[t].y<h[p].y),n=ext.filter(Boolean).length;
 if(d(4,8)/sz<.2)return 'pinza';
 if(n===4)return 'palma abierta';if(n===1&&ext[0])return 'índice';if(n===0)return 'puño';return 'otro'}
function orbit(dx,dy){const o=cam.position.clone().sub(ctl.target),s=new THREE.Spherical().setFromVector3(o);
 s.theta+=dx*4;s.phi=Math.min(3,Math.max(.15,s.phi+dy*3));cam.position.copy(ctl.target).add(o.setFromSpherical(s))}
function zoom(k){const o=cam.position.clone().sub(ctl.target);
 cam.position.copy(ctl.target).add(o.setLength(Math.min(80,Math.max(1,o.length()*Math.min(1.1,Math.max(.9,k))))))}
function point(tip,now){
 const x=(1-tip.x)*innerWidth,y=tip.y*innerHeight,c=$('cur');c.style.cssText=`display:block;left:${x}px;top:${y}px`;
 const el=document.elementFromPoint(x,y)?.closest('button,select,.it,input[type=checkbox]');
 if(el&&el===dw.el){if(now-dw.t>900&&now>cool){cool=now+1200;dw.t=now;el.click()}}else dw={el,t:now}}
function act(G,h){
 const p=h[9],now=performance.now();
 if(G==='palma abierta'){if(prevP&&cam)orbit(p.x-prevP.x,p.y-prevP.y);prevP={x:p.x,y:p.y};return}
 prevP=null;
 if(G==='pinza'){ang=Math.min(1,Math.max(0,(1-h[8].x-.15)/.7))*360;play=false;$('an').value=ang;$('anv').textContent=Math.round(ang)+'°';$('pl').textContent='▶ Iniciar';build3D()}
 else if(G==='puño'&&now>cool){cool=now+1500;build3D(true)}
 else if(G==='índice')point(h[8],now)}
function gLoop(){
 if(!gOn)return;requestAnimationFrame(gLoop);const v=$('gv');if(v.readyState<2||v.currentTime===gLast)return;gLast=v.currentTime;
 const H=lm.detectForVideo(v,performance.now()).landmarks,c=$('gc'),g=c.getContext('2d');
 c.width=v.videoWidth;c.height=v.videoHeight;g.fillStyle='#a3e635';
 H.forEach(h=>h.forEach(p=>{g.beginPath();g.arc(p.x*c.width,p.y*c.height,3,0,6.3);g.fill()}));
 $('cur').style.display='none';
 if(!H.length){prevP=prevD=null;return gs('No se detectan manos. Puedes usar mouse y teclado.')}
 if(H.length===2){const d=Math.hypot(H[0][9].x-H[1][9].x,H[0][9].y-H[1][9].y);if(prevD&&R)zoom(prevD/d);prevD=d;prevP=null;return gs('Dos manos: separar = acercar, juntar = alejar')}
 prevD=null;const G=gesture(H[0]);gs('Gesto detectado: '+G);act(G,H[0])}
$('gb').onclick=()=>gOn?gOff():gestStart();
