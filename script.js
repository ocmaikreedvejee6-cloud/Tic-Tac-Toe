// Tic Tac Toe — Vanilla JS
const cells = Array.from(document.querySelectorAll('.cell'));
const boardEl = document.getElementById('board');
const currentPlayerEl = document.getElementById('currentPlayer');
const restartBtn = document.getElementById('restart');
const resetScoresBtn = document.getElementById('resetScores');
const scoreXEl = document.getElementById('scoreX');
const scoreOEl = document.getElementById('scoreO');
const scoreDrawEl = document.getElementById('scoreDraw');

let board; // array of 9 strings: '', 'X', 'O'
let currentPlayer;
let isActive; // whether moves allowed
let scores = { X: 0, O: 0, Draw: 0 };

// Winning combinations (indices)
const WIN_COMBOS = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// Initialize game
function init() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  isActive = true;
  updateUI();
  cells.forEach(cell => {
    cell.classList.remove('x','o','winning');
    cell.textContent = '';
    cell.disabled = false;
  });
  bindEvents();
}
function bindEvents(){
  cells.forEach(cell => {
    cell.onclick = () => handleMove(cell);
    // keyboard accessibility: Enter or Space to place
    cell.onkeydown = (e) => {
      if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleMove(cell);
      }
    }
  });
  restartBtn.onclick = resetRound;
  resetScoresBtn.onclick = resetScores;
}

function handleMove(cell){
  if(!isActive) return;
  const idx = Number(cell.dataset.index);
  if(board[idx] !== '') return; // already taken

  board[idx] = currentPlayer;
  cell.textContent = currentPlayer;
  cell.classList.add(currentPlayer === 'X' ? 'x' : 'o');

  const result = checkResult();
  if(result) { // win or draw
    endRound(result);
  } else {
    // switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateUI();
  }
}

function checkResult() {
  // check for win
  for(const combo of WIN_COMBOS){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  // check for draw
  if(board.every(cell => cell !== '')) {
    return { winner: null }; // draw
  }
  return null; // game continues
}

function endRound(result){
  isActive = false;
  if(result.winner) {
    // highlight winning cells
    result.combo.forEach(i => {
      cells[i].classList.add('winning');
    });
    // update score
    scores[result.winner]++;
    updateScores();
    showTemporaryMessage(`${result.winner} wins!`);
  } else {
    scores.Draw++;
    updateScores();
    showTemporaryMessage(`It's a draw.`);
  }
}

function updateUI(){
  currentPlayerEl.textContent = currentPlayer;
}

function updateScores(){
  scoreXEl.textContent = scores.X;
  scoreOEl.textContent = scores.O;
  scoreDrawEl.textContent = scores.Draw;
}

function resetRound(){
  // keep scores but clear board
  init();
}

function resetScores(){
  scores = { X: 0, O: 0, Draw: 0 };
  updateScores();
  init();
}

function showTemporaryMessage(text){
  const prev = document.getElementById('tempMsg');
  if(prev) prev.remove();

  const msg = document.createElement('div');
  msg.id = 'tempMsg';
  msg.textContent = text;
  msg.style.cssText = `
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 18px;
    background: rgba(0,0,0,0.5);
    padding: 8px 12px;
    border-radius: 8px;
    font-weight:700;
    color: #fff;
    z-index: 40;
  `;
  document.querySelector('.app').appendChild(msg);
  // remove after 1.6s
  setTimeout(()=> msg.remove(), 1600);
}

// initialize first load
init();
