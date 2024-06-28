document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const cells = [];
    const rows = 6;
    const cols = 7;
    let currentPlayer = 'red';

    for (let row = 0; row < rows; row++) {
        cells[row] = [];
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            board.appendChild(cell);
            cells[row][col] = cell;
        }
    }

    // Function to switch player
    function switchPlayer() {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
    }

    // Function to check winner
    function checkWinner() {
        const directions = [
            { dr: 0, dc: 1 },  // horizontal
            { dr: 1, dc: 0 },  // vertical
            { dr: 1, dc: 1 },  // diagonal down-right
            { dr: 1, dc: -1 }  // diagonal down-left
        ];

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = cells[row][col];
                if (cell.classList.contains('red') || cell.classList.contains('yellow')) {
                    const player = cell.classList.contains('red') ? 'red' : 'yellow';
                    for (let { dr, dc } of directions) {
                        let count = 0;
                        for (let i = 0; i < 4; i++) {
                            const r = row + dr * i;
                            const c = col + dc * i;
                            if (r >= 0 && r < rows && c >= 0 && c < cols && cells[r][c].classList.contains(player)) {
                                count++;
                            } else {
                                break;
                            }
                        }
                        if (count === 4) {
                            return player;
                        }
                    }
                }
            }
        }
        return null;
    }

    // Function to drop disc
    function dropDisc(col) {
        for (let row = rows - 1; row >= 0; row--) {
            const cell = cells[row][col];
            if (!cell.classList.contains('red') && !cell.classList.contains('yellow')) {
                cell.classList.add(currentPlayer);
                const winner = checkWinner();
                if (winner) {
                    notifyWinner(winner);
                    board.removeEventListener('click', handleCellClick);
                } else {
                    switchPlayer();
                }
                break;
            }
        }
    }

    // Function to handle cell click
    function handleCellClick(event) {
        if (event.target.classList.contains('cell')) {
            const col = event.target.dataset.col;
            dropDisc(parseInt(col));
        }
    }

    board.addEventListener('click', handleCellClick);

    document.getElementById('restart-button').addEventListener('click', () => {
        cells.flat().forEach(cell => {
            cell.classList.remove('red', 'yellow');
        });
        currentPlayer = 'red';
        board.addEventListener('click', handleCellClick);
    });

    // Request Notification Permission
    if (Notification.permission !== 'granted') {
        Notification.requestPermission();
    }

    // Function to notify winner
    function notifyWinner(winner) {
        if (Notification.permission === 'granted') {
            new Notification(`${winner.toUpperCase()} wins!`);
        } else {
            alert(`${winner.toUpperCase()} wins!`);
        }
    }
});
