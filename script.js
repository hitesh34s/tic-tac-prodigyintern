const board = document.getElementById("board");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart");
const themeBtn = document.getElementById("toggle-theme");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");
const scoreDraw = document.getElementById("scoreDraw");

let currentPlayer = "X";
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

let scores = { X: 0, O: 0, Draw: 0 };

// Win patterns
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function createBoard() {
  board.innerHTML = "";
  gameState = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s Turn`;

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (gameState[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);
  if (!checkGameStatus()) {
    setTimeout(() => {
      const aiMove = getBestMove();
      makeMove(aiMove, "O");
      checkGameStatus();
    }, 500);
  }
}

function makeMove(index, player) {
  gameState[index] = player;
  const cell = board.querySelector(`[data-index='${index}']`);
  cell.textContent = player;
  cell.classList.add("taken");
}

function checkGameStatus() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      statusText.textContent = `🎉 Player ${gameState[a]} Wins!`;
      gameActive = false;
      updateScore(gameState[a]);
      return true;
    }
  }

  if (!gameState.includes("")) {
    statusText.textContent = "It's a Draw!";
    gameActive = false;
    updateScore("Draw");
    return true;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
  return false;
}

function getBestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < 9; i++) {
    if (gameState[i] === "") {
      gameState[i] = "O";
      let score = minimax(gameState, 0, false);
      gameState[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(state, depth, isMaximizing) {
  const winner = checkWinner();
  if (winner === "O") return 10 - depth;
  if (winner === "X") return depth - 10;
  if (!state.includes("")) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "O";
        best = Math.max(best, minimax(state, depth + 1, false));
        state[i] = "";
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (state[i] === "") {
        state[i] = "X";
        best = Math.min(best, minimax(state, depth + 1, true));
        state[i] = "";
      }
    }
    return best;
  }
}

function checkWinner() {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (
      gameState[a] &&
      gameState[a] === gameState[b] &&
      gameState[a] === gameState[c]
    ) {
      return gameState[a];
    }
  }
  return null;
}

function updateScore(result) {
  if (result === "X") scores.X++;
  else if (result === "O") scores.O++;
  else scores.Draw++;

  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.Draw;
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

function loadTheme() {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
}

// Event Listeners
restartBtn.addEventListener("click", createBoard);
themeBtn.addEventListener("click", toggleTheme);

// Initialize
loadTheme();
createBoard();
