// cms.js - simple activity manager
const addAct = document.getElementById('addAct');
const nameIn = document.getElementById('actName');
const listEl = document.getElementById('actsList');

function loadActs(){
  const arr = JSON.parse(localStorage.getItem('rafiq_activities')||'[]');
  listEl.innerHTML = arr.map((a,i)=>`<li>${a} <button onclick="delAct(${i})">Delete</button></li>`).join('') || '<li>No activities</li>';
}
window.delAct = function(i){
  const arr = JSON.parse(localStorage.getItem('rafiq_activities')||'[]');
  arr.splice(i,1);
  localStorage.setItem('rafiq_activities', JSON.stringify(arr));
  loadActs();
}
addAct.addEventListener('click', ()=> {
  const val = nameIn.value.trim(); if(!val) return alert('Enter a name');
  const arr = JSON.parse(localStorage.getItem('rafiq_activities')||'[]');
  arr.unshift(val);
  localStorage.setItem('rafiq_activities', JSON.stringify(arr));
  nameIn.value=''; loadActs();
});
loadActs();
