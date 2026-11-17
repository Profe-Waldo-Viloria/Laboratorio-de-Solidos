// Interfaz: paneles plegables, ventana de creadores y redibujado al cargar las fuentes.
(()=>{
 const app=$('app'),ctr=$('ctr'),phone=()=>matchMedia('(max-width:1000px)').matches,L=[];
 const setCol=(o,c)=>{o.el.classList.toggle('col',c);o.b.textContent=c?'+':'−';o.b.setAttribute('aria-expanded',String(!c));if(o.cls)o.host.classList.toggle(o.cls,c);requestAnimationFrame(()=>resize())};
 [['#app>aside:first-child','Catálogo',1,app,'colL'],['#c2','Gráfica 2D',0,ctr,'k2'],['#c3','Modelo 3D',0,ctr,'k3'],['#ctl','Controles',0,ctr,''],['#inf','Información',1,app,'colR']].forEach(([sel,t,side,host,cls])=>{
  let el=document.querySelector(sel);if(!el.classList.contains('pn'))el=el.closest('.pn');
  const b=document.createElement('button'),s=document.createElement('span'),o={el,b,host,cls};
  el.classList.add('pl');if(side)el.classList.add('side');b.className='tg';b.type='button';b.textContent='−';b.setAttribute('aria-label','Plegar o desplegar: '+t);s.className='tt';s.textContent=t;
  el.prepend(s);el.prepend(b);b.onclick=()=>setCol(o,!el.classList.contains('col'));L.push(o)});
 if(phone())setCol(L[0],true);
 $('cat').addEventListener('click',e=>{if(e.target.closest('.it')&&phone()){setCol(L[0],true);ctr.scrollIntoView({behavior:'smooth',block:'start'})}});
 const cr=$('cr'),open=v=>{cr.hidden=!v;if(v)$('crx').focus()};
 $('cb').onclick=$('cbc').onclick=()=>open(true);$('crx').onclick=()=>open(false);
 cr.addEventListener('click',e=>{if(e.target===cr)open(false)});addEventListener('keydown',e=>{if(e.key==='Escape')open(false)});
 if(document.fonts)document.fonts.ready.then(()=>draw2D());
})();
