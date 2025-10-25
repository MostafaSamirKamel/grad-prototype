// dashboard.js - builds charts from localStorage sessions
const recent = document.getElementById('recentSessions');
const accCtx = document.getElementById('accChart').getContext('2d');
const sessions = JSON.parse(localStorage.getItem('rafiq_sessions')||'[]');
recent.innerHTML = sessions.slice(0,12).map(s=>`<li>${new Date(s.timestamp).toLocaleString()} — Acc: ${s.accuracy}% — Att: ${s.attention}%</li>`).join('') || '<li>No sessions yet</li>';

const labels = sessions.map(s=>new Date(s.timestamp).toLocaleTimeString());
const data = sessions.map(s=>s.accuracy||0);
new Chart(accCtx, { type:'line', data:{labels, datasets:[{label:'Accuracy',data,fill:true,tension:0.3}]}, options:{scales:{y:{beginAtZero:true,max:100}}}});

// live attention display from emotion demo
setInterval(()=> {
  const a = localStorage.getItem('rafiq_live_attention') || 45;
  document.getElementById('attFill').style.width = a + '%';
  document.getElementById('attAvg').textContent = a + '%';
}, 1000);
