const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ticTacToe() {
  const field = [null, null, null, null, null, null, null, null, null];
  let moveCounter = 0;

  const getPlayer = () => {
    if (moveCounter % 2 === 0 || moveCounter === 0) {
      return 'X';
    }

    if (moveCounter % 2 !== 0) {
      return 'O';
    }
  }

  const move = (value) => {
    const validInput = (value) => {
      return value < 0 || value > 8;
    }

    const emptySell = (value) => {
      return field[value] !== null;
    }

    if (validInput(value)) {
      throw new Error('Input must be between 1 and 9')
    }

    if (emptySell(value)) {
      throw new Error('Sell is already occupied')
    }

    if (!validInput(value) && !emptySell(value)) {
      field[value] = getPlayer();
      moveCounter += 1;
    }

    return;
  }

  const checkWin = () => {
    const winLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let i = 0; i < winLines.length; i++) {
      const [a, b, c] = winLines[i];

      if (field[a] === field[b] && field[b] === field[c] && field[c] === 'X') {
        moveCounter += 1;
        return true;
      }
      if (field[a] === field[b] && field[b] === field[c] && field[c] === 'O') {
        moveCounter += 1;
        return true;
      }
    }

    return false;
  }

  const checkDraw = () => {
    return moveCounter === 9;
  }

  const restart = () => {
    moveCounter = 0;
    for (let i = 0; i < field.length; i++) {
      field[i] = null;
    }

    return;
  }

  return { move, restart, checkWin, checkDraw, getPlayer, field };
}

function boardVisual(arr) {

  let boardStr = '';

  for (let i = 0; i < arr.length; i++) {
    if (i === 3) {
      boardStr += '|\n'
    }
    if (i === 6) {
      boardStr += '|\n'
    }

    if (arr[i] === null) {
      boardStr += '|  >' + (i + 1) + ' ';
      continue
    }
    boardStr += '|  ' + (arr[i]) + '  ';
  }

  boardStr += '|'

  return boardStr;
}


const { field, move, restart, checkWin, checkDraw, getPlayer } = ticTacToe();

console.log('Lets play, enter a key, X - first');
console.log(boardVisual(field));

rl.on('line', input => {
  if (input === '') {
    console.log('Empty input');
    console.log('Player', getPlayer(), 'to move');

    return;
  }

  if (input.toLowerCase() === 'x') {
    console.log('You quitted the game')
    rl.close();

    return
  }

  if (input.toLowerCase() === 'r') {
    restart();
    console.log('Game is restarted \nPlayer X - make a move');
    console.log(boardVisual(field));

    return;
  }

  const inputToIndex = parseInt(input) - 1;

  if (checkWin()) {
    console.log(boardVisual(field));
    console.log('Player', getPlayer(), 'won! Press `R` to restart or `X` to close the game');

    return;
  }
  if (checkDraw()) {
    console.log(boardVisual(field));
    console.log('It`s a draw! Press `R` to restart or `X` to close the game');

    return;
  }

  try {
    move(inputToIndex);
    console.log(boardVisual(field));
  } catch (err) {
    console.log(`${err.message}`);
    console.log('Player', getPlayer(), 'to move');
  }

  console.log('Player', getPlayer(), 'to move');

  rl.prompt();
});

rl.on('close', () => {
  process.exit(0);
});