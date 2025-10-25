/* RAFIQ prototype JS
   - Handles navigation, speech recognition (Web Speech API), drag/drop matching,
   - Chart demo (Chart.js), CMS localStorage, language toggle (RTL support).
*/

document.addEventListener('DOMContentLoaded', () => {
  // simple view routing
  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('.sidebar nav li');
  const content = document.getElementById('content');
  function showView(name){
    views.forEach(v => v.classList.toggle('hidden', v.dataset.view !== name));
    navItems.forEach(li => li.classList.toggle('active', li.dataset.view === name));
    // update URL hash (non-blocking)
    location.hash = name;
  }
  navItems.forEach(n => n.addEventListener('click', ()=> showView(n.dataset.view)));
  // hero quick buttons
  document.getElementById('startSessionBtn').addEventListener('click', () => showView('child'));
  document.getElementById('openDashboard').addEventListener('click', () => showView('dashboard'));
  document.querySelectorAll('.card .goto').forEach(btn => {
    btn.addEventListener('click', (e)=> showView(e.target.dataset.view || 'child'));
  });

  // Okay show initial view based on hash
  const initial = (location.hash && location.hash.replace('#','')) || 'home';
  showView(initial);

  // RTL / Language toggle (basic: switch dir and strings)
  const rtlBtn = document.getElementById('rtlBtn');
  const langSelect = document.getElementById('langSelect');
  rtlBtn.addEventListener('click', ()=> {
    const html = document.documentElement;
    const isRtl = html.getAttribute('dir') === 'rtl';
    html.setAttribute('dir', isRtl ? 'ltr' : 'rtl');
    rtlBtn.setAttribute('aria-pressed', String(!isRtl));
  });
  langSelect.addEventListener('change', (e) => {
    const v=e.target.value;
    if(v==='ar'){
      // minimal translations to demonstrate UI change
      document.documentElement.lang='ar';
      document.querySelector('.hero h2').textContent='مرحبا بكم في RAFIQ';
      document.querySelector('.hero p').textContent='نظام تفاعلي لعلاج الطفل — واجهة تجريبية';
      document.getElementById('startSessionBtn').textContent='ابدأ جلسة';
      document.getElementById('openDashboard').textContent='لوحة الأخصائي';
      document.getElementById('micBtn').textContent='🎤 استمع';
    } else {
      document.documentElement.lang='en';
      document.querySelector('.hero h2').textContent='Welcome to RAFIQ';
      document.querySelector('.hero p').textContent='Adaptive, AI-assisted therapeutic activities for children with ASD — prototype UI.';
      document.getElementById('startSessionBtn').textContent='Start Child Session';
      document.getElementById('openDashboard').textContent='Open Therapist Dashboard';
      document.getElementById('micBtn').textContent='🎤 Start Listening';
    }
  });

  // Toast helper
  function showToast(text, t=2500){
    const toast = document.getElementById('toast');
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toast.hideTimer);
    toast.hideTimer = setTimeout(()=> toast.classList.remove('show'), t);
  }
  window.showToast = showToast;

  // Matching drag/drop logic
  const drags = document.querySelectorAll('.dragitem');
  const dropTarget = document.getElementById('dropTarget');
  const matchFeedback = document.getElementById('matchFeedback');
  const statMatches = document.getElementById('statMatches');
  let matches = 0;
  drags.forEach(img => {
    img.addEventListener('dragstart', (e)=> {
      e.dataTransfer.setData('text/plain', img.dataset.name);
    });
  });

  dropTarget.addEventListener('dragover', e => { e.preventDefault(); dropTarget.style.background='#f1f5f9'; });
  dropTarget.addEventListener('dragleave', e => { dropTarget.style.background=''; });
  dropTarget.addEventListener('drop', e => {
    e.preventDefault();
    dropTarget.style.background='';
    const name = e.dataTransfer.getData('text/plain');
    // the target word is in #wordToSay
    const target = document.getElementById('wordToSay').textContent.trim().toLowerCase();
    if(name === target){
      matchFeedback.textContent = 'Good job! ✅';
      matchFeedback.style.color = '#059669';
      matches++;
      statMatches.textContent = matches;
      animateElement(dropTarget, '#bbf7d0');
    } else {
      matchFeedback.textContent = 'Try again ✋';
      matchFeedback.style.color = '#b91c1c';
      animateElement(dropTarget, '#fecaca');
    }
  });

  function animateElement(el, color){
    const old = el.style.background;
    el.style.background = color;
    setTimeout(()=> el.style.background = old, 700);
  }

  // Simple speech recognition (Web Speech API)
  const micBtn = document.getElementById('micBtn');
  const speechResult = document.getElementById('speechResult');
  const pronScore = document.getElementById('pronScore');
  const statPron = document.getElementById('statPron');
  let recognition, recognizing=false, numPron=0, pronSum=0;
  if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.addEventListener('result', (evt) => {
      const text = evt.results[0][0].transcript;
      speechResult.textContent = text;
      // compute a naive "pronunciation score": similarity with target word
      const target = document.getElementById('wordToSay').textContent.trim().toLowerCase();
      const score = text.toLowerCase().includes(target) ? 85 + Math.round(Math.random()*15) : Math.round(Math.random()*60);
      pronScore.textContent = score + '%';
      pronSum += score; numPron++;
      statPron.textContent = Math.round(pronSum/numPron) + '%';
    });
    recognition.addEventListener('end', ()=> {
      recognizing=false; micBtn.textContent = (document.documentElement.lang==='ar' ? '🎤 استمع' : '🎤 Start Listening');
    });
  } else {
    micBtn.disabled = true;
    micBtn.textContent = 'Speech not supported';
  }

  micBtn.addEventListener('click', ()=>{
    if(!recognition) return showToast('Speech recognition not available in this browser');
    if(!recognizing){
      try{
        recognition.start();
        recognizing=true; micBtn.textContent = 'Listening...';
      }catch(e){}
    } else {
      recognition.stop();
      recognizing=false; micBtn.textContent = '🎤 Start Listening';
    }
  });

  // Camera start/stop (no CV - placeholder)
  const camToggle = document.getElementById('camToggle');
  const video = document.getElementById('video');
  let stream=null;
  camToggle.addEventListener('click', async ()=>{
    if(!stream){
      try{
        stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
        video.srcObject = stream;
        camToggle.textContent = 'Stop Camera';
        // fake "eye contact" and attention numbers to demo UI
        startFakeAttention();
      } catch(e){
        showToast('Camera permission denied or not available');
      }
    } else {
      stopStream();
      camToggle.textContent = 'Start Camera';
      document.getElementById('eyeContact').textContent = '—';
      document.getElementById('attentionLevel').textContent = '—';
    }
  });

  function stopStream(){
    if(stream){
      stream.getTracks().forEach(t => t.stop());
      video.srcObject = null;
      stream = null;
      stopFakeAttention();
    }
  }

  // fake attention simulation (replace with real Mediapipe/TensorFlow in production)
  let attentionTimer=null;
  function startFakeAttention(){
    const eyeEl = document.getElementById('eyeContact');
    const attEl = document.getElementById('attentionLevel');
    attentionTimer = setInterval(()=>{
      const e = Math.round(40 + Math.random()*60); // %
      const a = Math.round(30 + Math.random()*70);
      eyeEl.textContent = `${Math.round(e/10)/10}s`;
      attEl.textContent = `${a}%`;
      // update therapist metric visual
      document.getElementById('attentionFill').style.width = a + '%';
      document.getElementById('attentionAvg').textContent = a + '%';
    }, 1400);
  }
  function stopFakeAttention(){ clearInterval(attentionTimer); attentionTimer=null; }

  // session time counter
  let sessionTimer=null, seconds=0, statTime = document.getElementById('statTime');
  document.getElementById('startSessionBtn').addEventListener('click', ()=> {
    startSessionTimer();
  });
  function startSessionTimer(){
    stopSessionTimer();
    seconds=0; sessionTimer=setInterval(()=> {
      seconds++;
      statTime.textContent = new Date(seconds*1000).toISOString().substr(14,5);
    },1000);
  }
  function stopSessionTimer(){ if(sessionTimer) clearInterval(sessionTimer); }

  document.getElementById('endSession').addEventListener('click', ()=> {
    stopSessionTimer();
    showToast('Session ended — data saved (local demo)');
    // persist a demo session to recent list
    addRecentSession({date: new Date(), accuracy: Math.round(50 + Math.random()*40), attention: Math.round(40 + Math.random()*40)});
    updateReports();
    showView('dashboard');
  });

  // Chart.js: pronunciation accuracy sample
  const accuracyChartCtx = document.getElementById('accuracyChart').getContext('2d');
  const sampleLabels = Array.from({length:7}, (_,i) => `S-${7-i}`);
  const sampleData = Array.from({length:7}, ()=> Math.round(50 + Math.random()*45));
  const accuracyChart = new Chart(accuracyChartCtx, {
    type:'line',
    data:{
      labels: sampleLabels,
      datasets:[{
        label:'Accuracy %',
        data: sampleData,
        fill:true,
        tension:0.3,
        pointRadius:4,
        backgroundColor:'rgba(37,99,235,0.08)',
        borderColor:'rgba(37,99,235,1)'
      }]
    },
    options:{
      responsive:true,
      scales:{y:{beginAtZero:true,max:100}}
    }
  });

  // Recent sessions (localStorage backed)
  function addRecentSession(obj){
    const all = JSON.parse(localStorage.getItem('rafiq_recent')||'[]');
    all.unshift(obj);
    localStorage.setItem('rafiq_recent', JSON.stringify(all.slice(0,12)));
    refreshRecent();
  }
  function refreshRecent(){
    const list = document.getElementById('recentList');
    const arr = JSON.parse(localStorage.getItem('rafiq_recent')||'[]');
    list.innerHTML = '';
    arr.forEach(s => {
      const li = document.createElement('li');
      const d = new Date(s.date);
      li.textContent = `${d.toLocaleString()} — Accuracy ${s.accuracy}% — Attention ${s.attention}%`;
      list.appendChild(li);
    });
    // reports table
    updateReports();
  }
  function updateReports(){
    const body = document.getElementById('reportTableBody');
    const arr = JSON.parse(localStorage.getItem('rafiq_recent')||'[]');
    body.innerHTML = arr.map(s=> {
      const d = new Date(s.date);
      return `<tr><td>${d.toLocaleDateString()}</td><td>${s.accuracy}%</td><td>${s.attention}%</td></tr>`;
    }).join('');
  }
  refreshRecent();

  // Export (print)
  document.getElementById('exportReportBtn').addEventListener('click', ()=> {
    window.print();
  });

  // Simple CMS (localStorage)
  const cmsList = document.getElementById('cmsList');
  function loadCMS(){
    const items = JSON.parse(localStorage.getItem('rafiq_cms')||'[]');
    cmsList.innerHTML = items.map((it,idx)=> `
      <div class="cms-item">
        <div>${it.title}</div>
        <div>
          <button onclick="editActivity(${idx})">Edit</button>
          <button onclick="deleteActivity(${idx})">Delete</button>
        </div>
      </div>
    `).join('') || '<div class="card">No activities yet</div>';
  }
  window.editActivity = function(i){
    const items = JSON.parse(localStorage.getItem('rafiq_cms')||'[]');
    const t = prompt('Edit activity title', items[i].title);
    if(t){ items[i].title = t; localStorage.setItem('rafiq_cms', JSON.stringify(items)); loadCMS(); }
  };
  window.deleteActivity = function(i){
    const items = JSON.parse(localStorage.getItem('rafiq_cms')||'[]');
    items.splice(i,1);
    localStorage.setItem('rafiq_cms', JSON.stringify(items));
    loadCMS();
  };
  document.getElementById('addActivityBtn').addEventListener('click', ()=> {
    const title = document.getElementById('newActivityTitle').value.trim();
    if(!title) return showToast('Enter activity title');
    const items = JSON.parse(localStorage.getItem('rafiq_cms')||'[]');
    items.unshift({title, created: new Date()});
    localStorage.setItem('rafiq_cms', JSON.stringify(items));
    document.getElementById('newActivityTitle').value='';
    loadCMS();
  });
  loadCMS();

  // recent demo sessions seed (only if empty)
  if(!(localStorage.getItem('rafiq_recent'))){
    const demo = [
      {date:new Date(Date.now()-6*24*3600e3),accuracy:62,attention:58},
      {date:new Date(Date.now()-5*24*3600e3),accuracy:70,attention:66},
      {date:new Date(Date.now()-4*24*3600e3),accuracy:74,attention:72},
      {date:new Date(Date.now()-3*24*3600e3),accuracy:68,attention:60},
      {date:new Date(Date.now()-2*24*3600e3),accuracy:72,attention:64},
      {date:new Date(),accuracy:75,attention:69},
    ];
    localStorage.setItem('rafiq_recent', JSON.stringify(demo));
    refreshRecent();
  }

  // helper: show/hide views by dataset attribute on clicks elsewhere
  document.querySelectorAll('[data-view]').forEach(el => {
    if(el.dataset.view && !el.matches('li')) {
      // ignore
    }
  });
});
