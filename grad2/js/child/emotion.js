// emotion.js - camera demo with fake metrics
const cam = document.getElementById('cam');
const camToggle = document.getElementById('camToggle');
const eyeEl = document.getElementById('eye');
const attEl = document.getElementById('att');
let stream=null, timer=null;
camToggle.addEventListener('click', async ()=>{
  if(!stream){
    try{
      stream = await navigator.mediaDevices.getUserMedia({video:true});
      cam.srcObject = stream;
      camToggle.textContent = 'Stop Camera';
      timer = setInterval(()=> {
        const eye = (Math.random()*2).toFixed(1) + 's';
        const att = Math.round(40 + Math.random()*50);
        eyeEl.textContent = eye;
        attEl.textContent = att + '%';
        // update therapist meter in dashboard (if open)
        localStorage.setItem('rafiq_live_attention', att);
      }, 900);
    }catch(e){
      alert('Camera access denied or not available.');
    }
  } else {
    stream.getTracks().forEach(t=>t.stop());
    stream=null;
    cam.srcObject=null;
    camToggle.textContent='Start Camera';
    clearInterval(timer);
  }
});
