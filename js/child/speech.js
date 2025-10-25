// speech.js - demo speech interactions (no server)
const micBtn = document.getElementById('micBtn');
const playBtn = document.getElementById('playBtn');
const transcript = document.getElementById('transcript');
const scoreEl = document.getElementById('score');
const saveBtn = document.getElementById('saveSession');
const nextWordBtn = document.getElementById('nextWord');
const targetWord = document.getElementById('targetWord');
const words = ['apple','banana','orange','cat','dog','book','school'];

micBtn.addEventListener('click', ()=> {
  // try Web Speech API, otherwise fake
  if('webkitSpeechRecognition' in window || 'SpeechRecognition' in window){
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang='en-US';
    r.onresult = e => {
      const text = e.results[0][0].transcript;
      transcript.textContent = text;
      computeScore(text);
    };
    r.onerror = ()=> alert('Speech recognition error or permission denied.');
    r.start();
  } else {
    transcript.textContent = 'apple';
    computeScore('apple');
  }
});

playBtn.addEventListener('click', ()=> {
  const utter = new SpeechSynthesisUtterance(targetWord.textContent);
  speechSynthesis.speak(utter);
});

function computeScore(text){
  const t = (text||'').toLowerCase();
  const tar = targetWord.textContent.toLowerCase();
  let score =  Math.max(20, Math.round((t.includes(tar)? 80 : Math.random()*60) + Math.random()*15));
  scoreEl.textContent = score + '%';
  // persist to sessionStorage as current partial session
  const s = JSON.parse(sessionStorage.getItem('rafiq_current')||'{}');
  s.last_score = score;
  sessionStorage.setItem('rafiq_current', JSON.stringify(s));
}

saveBtn.addEventListener('click', ()=> {
  const s = JSON.parse(sessionStorage.getItem('rafiq_current')||'{}');
  const prev = JSON.parse(localStorage.getItem('rafiq_sessions')||'[]');
  const record = { accuracy: s.last_score||Math.round(50+Math.random()*30), attention: Math.round(40+Math.random()*50), matches: Math.round(Math.random()*5), timestamp: Date.now() };
  prev.unshift(record);
  localStorage.setItem('rafiq_sessions', JSON.stringify(prev));
  // update stats UI
  document.getElementById('statMatches').textContent = record.matches;
  const all = JSON.parse(localStorage.getItem('rafiq_sessions')||'[]');
  const avg = Math.round(all.reduce((a,b)=>a+(b.accuracy||0),0)/all.length);
  document.getElementById('statAvg').textContent = avg + '%';
  alert('Session saved (local demo).');
});

nextWordBtn.addEventListener('click', ()=> {
  const w = words[Math.floor(Math.random()*words.length)];
  targetWord.textContent = w;
});
