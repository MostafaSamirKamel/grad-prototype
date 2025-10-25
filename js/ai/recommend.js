// recommend.js - front-end KNN-like rule demo
document.getElementById('runRec').addEventListener('click', ()=> {
  const acc = parseInt(document.getElementById('rAcc').value||0,10);
  const att = parseInt(document.getElementById('rAtt').value||0,10);
  let out = 'Speech Practice';
  if(acc < 55) out = 'Emotion Game';
  else if(acc < 75) out = 'Matching Game';
  else out = 'Social Story';
  document.getElementById('recOut').textContent = out;
});
