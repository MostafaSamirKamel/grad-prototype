// simple drag/drop matching game
const tiles = document.querySelectorAll('.tile');
const drop = document.getElementById('dropTarget');
const feedback = document.getElementById('gameFeedback');
const target = 'apple'; // in a full app this would change dynamically
tiles.forEach(t => {
  t.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', t.dataset.name); });
});
drop.addEventListener('dragover', e=> e.preventDefault());
drop.addEventListener('drop', e=> {
  e.preventDefault();
  const name = e.dataTransfer.getData('text/plain');
  if(name===target){
    feedback.textContent = 'Correct ✅';
    feedback.style.color = 'green';
  } else {
    feedback.textContent = 'Try again ✋';
    feedback.style.color = 'crimson';
  }
});
