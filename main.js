import canvasConfetti from "https://cdn.skypack.dev/canvas-confetti";

let winnerFound = false,
  player_O = 0,
  player_X = 0,
  randomPlayer = "",
  gameWinner = false,
  roundsWon = 5,
  rounds = 1;

const gameContainer = document.getElementById("ttt-container");
const cells = document.getElementsByClassName("cell");
const gameState = document.getElementById("player-turn");
const gameResult = document.getElementById("results");
const existRestartBtn = document.querySelector(".res-button");
const roundsEl = document.getElementById("rounds");

const WIN_CASES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

for (let i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", playerTurn);
}

function playerTurn(e) {
  let cellValue = e.target.innerHTML;
  if (!cellValue.length && !winnerFound) {
    e.target.innerHTML = randomPlayer === "X" ? "X" : "O";
    randomPlayer = randomPlayer === "X" ? "O" : "X";
    gameState.innerHTML = `It's ${randomPlayer} turn`;
    checkWinCases(WIN_CASES);
    checkDraw();
  } else {
    return;
  }
}

function checkWinCases(winCases) {
  for (let i = 0; i < winCases.length; i++) {
    const [a, b, c] = winCases[i];

    const [cellA, cellB, cellC] = [
      cells[a].innerHTML,
      cells[b].innerHTML,
      cells[c].innerHTML,
    ];

    if (cellA && cellA === cellB && cellB === cellC) {
      [a, b, c].forEach((cell) => cells[cell].classList.add("winner-cell"));
      winnerFound = true;
      rounds++;
      gameResult.innerHTML = `Player ${cellA} wins round ${rounds - 1}`;
      gameState.innerHTML = "";

      if (cellA === "O") {
        player_O++;
        document.getElementById("player-o").innerHTML = `Player_O: ${player_O}`;
      } else {
        player_X++;
        document.getElementById("player-x").innerHTML = `Player_X: ${player_X}`;
      }

      if (player_O === roundsWon || player_X === roundsWon) {
        gameWinner = true;
        gameResult.innerHTML = `Game winner: ${cellA}`;
        fillCellsWithWinner(cellA);
        refreshGame();
        const restartBtn = document.querySelector(".restart-button");
        if (restartBtn) {
          restartBtn.remove();
        }
        return;
      }

      if (!existRestartBtn && !gameWinner) {
        restartButton();
      }

      break;
    }
  }
}

function fillCellsWithWinner(winnerLetter) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = winnerLetter;
  }
  canvasConfetti();
}

function checkDraw() {
  if (!winnerFound) {
    let allCellsFilled = Array.from(cells).every(
      (cell) => cell.innerHTML.length > 0
    );

    if (allCellsFilled) {
      rounds++;
      gameResult.innerHTML = "DRAW";
      gameState.innerHTML = "";

      if (!existRestartBtn) {
        restartButton();
      }
    }
  }
}

function restartButton() {
  const restartBtn = document.createElement("button");
  restartBtn.innerHTML = "Next Round";
  restartBtn.classList = "restart-button";
  if (!gameWinner) {
    gameContainer.appendChild(restartBtn);
  } else {
    return;
  }
  restartBtn.addEventListener("click", restartGame);
}

function refreshGame() {
  const refreshBtn = document.createElement("button");
  refreshBtn.innerHTML = "Restart";
  refreshBtn.classList = "refresh-button";
  gameContainer.appendChild(refreshBtn);
  refreshBtn.addEventListener("click", refreshGameButton);
}

function refreshGameButton() {
  location.reload();
}

function restartGame() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = "";
    cells[i].classList.remove("winner-cell");
  }

  winnerFound = false;
  gameResult.innerHTML = "";

  const restartBtn = document.querySelector(".restart-button");
  if (restartBtn) {
    restartBtn.remove();
  }

  getRandomPlayer();
}

function getRandomPlayer() {
  roundsEl.innerHTML = `Round: ${rounds}`;
  randomPlayer = Math.random() < 0.5 ? "X" : "O";
  gameState.innerHTML = `Player ${randomPlayer} starts`;
}

getRandomPlayer();
