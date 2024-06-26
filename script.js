const cells = document.querySelectorAll('.cell');
const statusDiv = document.querySelector('.status');
const resetButton = document.getElementById('reset');
const modeSelect = document.getElementById('mode');

let currentPlayer = 'X';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let gameMode = 'human'; // Default game mode

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        statusDiv.textContent = `Player ${currentPlayer} has won!`;
        gameActive = false;
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDiv.textContent = "Game ended in a draw!";
        gameActive = false;
        return;
    }

    handlePlayerChange();
    if (gameMode === 'ai' && gameActive && currentPlayer === 'O') {
        setTimeout(handleAIMove, 500); // Adding a slight delay for better UX
    }
};

const handleCellClick = (e) => {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
};

const handleRestartGame = () => {
    gameActive = true;
    currentPlayer = 'X';
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDiv.textContent = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = "");
};

const handleAIMove = () => {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === "") availableCells.push(index);
    });

    if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length);
        const cellIndex = availableCells[randomIndex];
        const cell = document.querySelector(`.cell[data-index='${cellIndex}']`);
        handleCellPlayed(cell, cellIndex);
        handleResultValidation();
    }
};

const handleModeChange = () => {
    gameMode = modeSelect.value;
    handleRestartGame();
};

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', handleRestartGame);
modeSelect.addEventListener('change', handleModeChange);
statusDiv.textContent = `Player ${currentPlayer}'s turn`;
