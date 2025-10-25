// main.js - small helpers
(function(){
  // show current user
  const user = JSON.parse(localStorage.getItem('rafiq_user')||'null');
  if(user){
    // attach logout button if needed
    const el = document.createElement('div');
    el.style.position='fixed';el.style.left='14px';el.style.bottom='70px';el.style.background='#fff';el.style.padding='8px';el.style.borderRadius='8px';el.style.boxShadow='0 6px 12px rgba(12,16,50,0.06)';
    el.innerHTML = '<strong>'+ (user.email||'User') +'</strong> <button id="logoutBtn" style="margin-left:8px">Logout</button>';
    document.body.appendChild(el);
    document.getElementById('logoutBtn').addEventListener('click', ()=>{ localStorage.removeItem('rafiq_user'); location.href='index.html'; });
  }
})();
