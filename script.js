
// The Game Board


const Gameboard = (() => {
  let board = ["", "", "", "", "", "", "", "", ""];

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function getBoard() {
    return [...board];
  }

  function placeMark(index, mark) {
    if (index < 0 || index > 8 || board[index] !== "") {
      return false;
    }

    board[index] = mark;
    return true;
  }

  function checkWinner() {
    for (const combination of winningCombinations) {
      const [a, b, c] = combination;

      if (
        board[a] !== "" &&
        board[a] === board[b] &&
        board[b] === board[c]
      ) {
        return board[a];
      }
    }

    return null;
  }

  function isBoardFull() {
  return board.every((square) => square !== "");
}

  function reset() {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  return {
    getBoard,
    placeMark,
    checkWinner,
    isBoardFull,
    reset
  };
})();



// The Player Factory

function createPlayer(name, mark) {
  const getName = () => name;
  const getMark = () => mark;

  return {
    getName,
    getMark
  };
}


// The Game Controller

const playerOne = createPlayer("Player 1", "X");
const playerTwo = createPlayer("Player 2", "O");

const GameController = (() => {
  let currentPlayer = playerOne;
  let gameOver = false;

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function switchTurn() {
    currentPlayer =
      currentPlayer === playerOne ? playerTwo : playerOne;
  }
function playRound(index) {
  if (gameOver) {
    return "game-over";
  }

  const mark = currentPlayer.getMark();

  const moveSuccessful = Gameboard.placeMark(index, mark);

  if (!moveSuccessful) {
    return "invalid";
  }

  const winner = Gameboard.checkWinner();

  if (winner) {
    gameOver = true;
    return `${currentPlayer.getName()} wins!`;
  }

  if (Gameboard.isBoardFull()) {
    gameOver = true;
    return "It's a draw!";
  }

  switchTurn();
  return "continue";
}

function restart() {
  Gameboard.reset();
  currentPlayer = playerOne;
  gameOver = false;
}
  
  return {
    getCurrentPlayer,
    playRound,
    restart
  };
})();

// The Display Controller


const cells = document.querySelectorAll(".cell");
const status = document.querySelector("#status");
const restartButton = document.querySelector("#restart");

function renderBoard() {
  const board = Gameboard.getBoard();

  cells.forEach((cell, index) => {
    cell.textContent = board[index];
    cell.disabled = board[index] !== "";
  });
}

function updateStatus(message) {
  status.textContent = message;
}

function handleCellClick(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  const result = GameController.playRound(index);

  renderBoard();

  if (result === "invalid" || result === "game-over") {
    return;
  }

  if (result === "continue") {
    const player = GameController.getCurrentPlayer();

    updateStatus(
      `${player.getName()}'s turn (${player.getMark()})`
    );
  } else {
    updateStatus(result);
  }
}

cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
});

restartButton.addEventListener("click", () => {
  GameController.restart();
  renderBoard();
  updateStatus("Player 1's turn (X)");
});

renderBoard();

