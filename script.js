document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const restartButton = document.getElementById('restart');
    const undoButton = document.getElementById('undo');

    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let history = [];
    let score = { X: 0, O: 0 };

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

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartButton.addEventListener('click', restartGame);
    undoButton.addEventListener('click', undoMove);

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = parseInt(cell.getAttribute('data-index'));

        if (gameState[cellIndex] !== '' || checkWinner()) return;

        history.push([...gameState]);
        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        cell.classList.add('animate');

        if (checkWinner()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            score[currentPlayer]++;
            updateScore();
            highlightWinningCells();
        } else if (gameState.includes('')) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        } else {
            message.textContent = 'Draw!';
        }
    }

    function checkWinner() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return true;
            }
        }
        return false;
    }

    function highlightWinningCells() {
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                document.querySelector(`[data-index='${a}']`).classList.add('winner');
                document.querySelector(`[data-index='${b}']`).classList.add('winner');
                document.querySelector(`[data-index='${c}']`).classList.add('winner');
            }
        }
    }

    function updateScore() {
        scoreX.textContent = score.X;
        scoreO.textContent = score.O;
    }

    function restartGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('winner');
            cell.classList.remove('animate');
        });
        message.textContent = '';
        history = [];
    }

    function undoMove() {
        if (history.length > 0) {
            gameState = history.pop();
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            cells.forEach((cell, index) => {
                cell.textContent = gameState[index];
                cell.classList.remove('winner');
                cell.classList.remove('animate');
            });
            message.textContent = '';
        }
    }
});
