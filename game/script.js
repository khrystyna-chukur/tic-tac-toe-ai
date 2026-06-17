const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

// Гравець завжди Х, комп'ютер завжди О
let playerTurn = true; 
let gameState = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Рядки
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Стовпчики
    [0, 4, 8], [2, 4, 6]             // Діагоналі
];

// Обробка кліку гравця (Х)
function handleCellClick(e) {
    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // Якщо клітинка зайнята, гра завершена або зараз хід комп'ютера — ігноруємо
    if (gameState[clickedCellIndex] !== "" || !isGameActive || !playerTurn) {
        return;
    }

    // Хід гравця
    makeMove(clickedCellIndex, 'X');

    if (checkResult('X')) return;

    // Передаємо хід комп'ютеру з невеликою затримкою для реалістичності
    playerTurn = false;
    statusText.innerText = "Робот думає...🤖";
    setTimeout(computerMove, 500);
}

// Функція для здійснення ходу
function makeMove(index, player) {
    gameState[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.innerText = player;
    cell.classList.add(player);
}

// Логіка штучного суперника (О)
function computerMove() {
    if (!isGameActive) return;

    let move = -1;

    // 1. Стратегія: Чи може комп'ютер виграти прямо зараз?
    move = findBestMove('O');

    // 2. Стратегія: Якщо виграти не можна, чи треба заблокувати гравця (Х)?
    if (move === -1) {
        move = findBestMove('X');
    }

    // 3. Стратегія: Якщо ніхто не загрожує, займаємо центр
    if (move === -1 && gameState[4] === "") {
        move = 4;
    }

    // 4. Стратегія: Якщо центр зайнятий, беремо випадкову порожню клітинку
    if (move === -1) {
        let emptyCells = [];
        gameState.forEach((val, idx) => {
            if (val === "") emptyCells.push(idx);
        });
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            move = emptyCells[randomIndex];
        }
    }

    // Робимо хід комп'ютера
    if (move !== -1) {
        makeMove(move, 'O');
    }

    if (checkResult('O')) return;

    // Повертаємо хід гравцю
    playerTurn = true;
    statusText.innerText = "Твій хід! (Х)";
}

// Помічник для пошуку критичних клітинок (для виграшу або блокування)
function findBestMove(player) {
    for (let condition of winningConditions) {
        let a = gameState[condition[0]];
        let b = gameState[condition[1]];
        let c = gameState[condition[2]];

        // Шукаємо лінію, де дві клітинки зайняті одним гравцем, а третя — порожня
        if (a === player && b === player && c === "") return condition[2];
        if (a === player && c === player && b === "") return condition[1];
        if (b === player && c === player && a === "") return condition[0];
    }
    return -1;
}

// Перевірка результату гри
function checkResult(player) {
    let roundWon = false;

    for (let condition of winningConditions) {
        let a = gameState[condition[0]];
        let b = gameState[condition[1]];
        let c = gameState[condition[2]];

        if (a === player && b === player && c === player) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        if (player === 'X') {
            statusText.innerText = "Ти переміг! 🎉 Перемога за людством!";
            statusText.style.color = '#4caf50';
        } else {
            statusText.innerText = "Комп'ютер переміг! 🤖 Повстання машин!";
            statusText.style.color = '#ff5722';
        }
        isGameActive = false;
        return true;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusText.innerText = "Нічия! 🤝 Ніхто не поступився.";
        statusText.style.color = '#ffeb3b';
        isGameActive = false;
        return true;
    }

    return false;
}

// Скидання гри
function restartGame() {
    playerTurn = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    isGameActive = true;
    statusText.innerText = "Твій хід! (Х)";
    statusText.style.color = '#eceff1';
    
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('X', 'O');
    });
}

// Слухачі подій
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);