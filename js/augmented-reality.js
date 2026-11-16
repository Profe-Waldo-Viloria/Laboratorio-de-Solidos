// Cámara compartida (gestos + AR) y modo AR: superposición visual educativa, sin anclaje espacial.
const CamX={stream:null,users:new Set(),
 async get(u){
  if(!window.isSecureContext||!navigator.mediaDevices)throw new Error('La cámara requiere HTTPS o localhost.');
  if(!this.stream)this.stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:640,height:480},audio:false});
  this.users.add(u);return this.stream},
 release(u){this.users.delete(u);if(!this.users.size&&this.stream){this.stream.getTracks().forEach(t=>t.stop());this.stream=null}}};
let arOn=false;
function arNote(msg,ms){const n=document.createElement('div');n.id='arn';n.textContent=msg;$('c3').appendChild(n);if(ms)setTimeout(()=>n.remove(),ms)}
async function arToggle(){
 const b=$('ab');
 if(arOn){arOn=false;$('arv')?.remove();$('arn')?.remove();if(grid)grid.visible=true;CamX.release('ar');b.textContent='🕶 Modo AR';return}
 try{
  const s=await CamX.get('ar'),v=document.createElement('video');
  v.id='arv';v.autoplay=true;v.muted=true;v.playsInline=true;v.srcObject=s;$('c3').prepend(v);
  if(grid)grid.visible=false;arOn=true;b.textContent='🕶 Salir de AR';
  arNote('Superposición visual educativa: el modelo no queda anclado al espacio.')
 }catch(e){arNote(e.name==='NotAllowedError'?'Permiso de cámara denegado. El modo AR es opcional; el resto de la app funciona igual.':e.message,5000)}}
$('ab').onclick=arToggle;
