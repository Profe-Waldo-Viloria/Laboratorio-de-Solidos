// Portada: animación de un paraboloide generado por revolución y botón de entrada.
(()=>{
 const cv=document.getElementById('cover'),c=document.getElementById('cv'),g=c.getContext('2d'),go=document.getElementById('go');
 const still=matchMedia('(prefers-reduced-motion: reduce)').matches,lock=v=>document.querySelectorAll('header,#app').forEach(e=>e.inert=v);
 let t=0,raf=0;
 function draw(){
  const W=c.width=c.clientWidth,H=c.height=c.clientHeight,s=Math.min(W,H)/3.4,tl=.55;g.clearRect(0,0,W,H);g.lineWidth=1.2;
  const P=(r,a,h)=>[W/2+r*Math.cos(a)*s,H/2-(h*Math.cos(tl)-r*Math.sin(a)*Math.sin(tl))*s],hh=r=>r*r/1.6-.8;
  g.strokeStyle='rgba(94,234,212,.55)';
  for(let i=1;i<=9;i++){const r=1.6*Math.sqrt(i/9);g.beginPath();for(let k=0;k<=64;k++){const p=P(r,k/64*6.2832,hh(r));k?g.lineTo(...p):g.moveTo(...p)}g.stroke()}
  g.strokeStyle='rgba(163,230,53,.6)';
  for(let m=0;m<14;m++){const a=t+m*6.2832/14;g.beginPath();for(let k=0;k<=24;k++){const r=1.6*k/24,p=P(r,a,hh(r));k?g.lineTo(...p):g.moveTo(...p)}g.stroke()}
  t+=.006;if(!still)raf=requestAnimationFrame(draw)}
 function close(){cv.classList.add('out');cancelAnimationFrame(raf);lock(false);setTimeout(()=>{cv.hidden=true;if(typeof resize==='function')resize()},650)}
 go.onclick=close;
 addEventListener('keydown',e=>{if(e.key==='Enter'&&!cv.hidden&&!cv.classList.contains('out'))close()});
 if(still)addEventListener('resize',draw);
 lock(true);draw();go.focus({preventScroll:true});
})();
