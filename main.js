const menu = document.querySelector('.menu');
const grid = document.querySelector('.grid');
const restart = document.querySelector('.restart');
const home = document.querySelector('.home');
const playerselection = document.querySelector('.twoplayers');
const computerselection = document.querySelector('.computer');
const xoselection = document.querySelector('.xoselection');
const firstplayer = document.querySelector('.fplyr span');
const secondplayer = document.querySelector('.splyr span');
const o = document.querySelector('.op');
const x = document.querySelector('.xp');
const start = document.querySelector('.start');
const row = document.querySelector('.row');
const winnerstatus = document.querySelector('.whowonstatus');
const tictactoe = new TicTacToe();
const wins = [
  ['0', '1', '2'],
  ['0', '4', '8'],
  ['0', '3', '6'],
  ['3', '4', '5'],
  ['6', '7', '8'],
  ['2', '4', '6'],
  ['2', '5', '8'],
  ['1', '4', '7'],
];

function TicTacToe() {
  this.p1Cells = [];
  this.p2Cells = [];
  this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  this.availableCells = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
  this.aiturn = false;
  this.move = 0;
  this.gameType = 'ai';
  this.player = '';
  this.computer = '';

  this.assignLetter = function() {
    this.player = o.classList.contains('pselected') ? 'O' : 'X';
    this.computer = this.player === 'X' ? 'O' : 'X';
    if (this.computer === 'X') {
      this.aiturn = true;
    } else {
      this.aiturn = false;
    }
  };

  this.playerMoves = function(cell) {
    this.aiturn = true;
    this.board[cell] = this.player;
    document.querySelector(`#box${cell}`).innerHTML = this.player;
    this.updateAvailableCells(cell);
    this.p1Cells.push(cell);

    // update board to show it is the other users turn
    this.playerIndicator();

    // check if game is over
    const gameOver = this.isGameOver(this.player);
    this.move++;

    if (gameOver) {
      winnerstatus.innerHTML = `${this.player} wins in ${this.move} moves!`;
      this.availableCells = [];

      // if not over, let AI go
    } else if (this.availableCells.length !== 0) {
      if (this.gameType === 'ai') {
        this.computerMoves();
      }
    }
  };

  this.playerTwoMoves = function(cell) {
    this.aiturn = false;
    this.board[cell] = this.computer;
    document.querySelector(`#box${cell}`).innerHTML = this.computer;
    this.updateAvailableCells(cell);
    this.p2Cells.push(cell);

    this.playerIndicator();
    const gameOver = this.isGameOver(this.computer);
    this.move++;
    if (gameOver) {
      winnerstatus.innerHTML = `${this.computer} wins in ${this.move} moves!`;
      this.availableCells = [];
    }
  };

  this.computerMoves = function() {
    if (this.aiturn) {
      // run minimax to get the best ai move
      const bestSpot = this.minimax(this.board, this.computer);
      this.aiturn = false;

      this.board[bestSpot.index] = this.computer;
      document.querySelector(`#box${bestSpot.index}`).innerHTML = this.computer;
      this.updateAvailableCells(bestSpot.index);
      this.p2Cells.push(bestSpot.index);
      this.playerIndicator();
      const gameOver = this.isGameOver(this.computer);
      this.move++;

      if (gameOver) {
        winnerstatus.innerHTML = `${this.computer} wins in ${this.move} moves!`;
        this.availableCells = [];
      }
    } else {
      return false;
    }
  };

  this.minimax = function(newBoard, player) {
    const availSpots = this.emptyIndexies(newBoard);
    /* checks for the terminal states such as win, lose, and tie
    and returning a value accordingly */
    if (this.isGameOver(this.player)) {
      return { score: -10 }; // return the lowest score for the player
    } else if (this.isGameOver(this.computer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }

    // an array to collect all the move objects
    const moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      // create an object for each and store the index of that spot
      const move = {};
      move.index = newBoard[availSpots[i]];

      // set the empty spot to the current player
      newBoard[availSpots[i]] = player;

      /* collect the score resulted from calling minimax
      on the opponent of the current player */
      const result = this.minimax(newBoard, player === this.computer ? this.player : this.computer);
      move.score = result.score;

      // reset the spot to empty
      newBoard[availSpots[i]] = move.index;
      // push the object to the array
      moves.push(move);
    }

    // if it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove;
    if (player === this.computer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // else loop over the moves and choose the move with the lowest score
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    // return the chosen move (object) from the moves array
    return moves[bestMove];
  };

  // returns the available spots on the board for the minimax algorithm
  this.emptyIndexies = function(board) {
    return board.filter(s => s !== 'O' && s !== 'X');
  };

  this.updateAvailableCells = function(cell) {
    const i = this.availableCells.indexOf(`${cell}`);
    // update the available cell array in place to remove the user selected cell
    this.availableCells.splice(i, 1);
  };

  // ensure move is legal
  this.isAvailable = function(cell) {
    return this.availableCells.indexOf(cell) > -1;
  };

  this.playerIndicator = function() {
    if (this.gameType === 'versus') {
      if (this.aiturn === true) {
        winnerstatus.innerHTML = 'P2 TURN';
      } else {
        winnerstatus.innerHTML = 'P1 TURN';
      }
    } else if (this.gameType === 'ai') {
      if (this.aiturn === true) {
        winnerstatus.innerHTML = 'COMPUTER TURN';
      } else {
        winnerstatus.innerHTML = 'YOUR TURN';
      }
    }
  };

  this.pcselection = function(e) {
    e.stopPropagation();
    if (e.target.classList.contains('pselected')) {
      this.gameType = '';
      e.target.classList.remove('pselected');
    } else {
      this.gameType = 'ai';
      e.target.classList.add('pselected');
      playerselection.classList.remove('pselected');
      xoselection.style.display = 'block';
    }
  };

  this.versus = function(e) {
    e.stopPropagation();
    if (e.target.classList.contains('pselected')) {
      this.gameType = '';
      e.target.classList.remove('pselected');
    } else {
      this.gameType = 'versus';
      e.target.classList.add('pselected');
      computerselection.classList.remove('pselected');
      xoselection.style.display = 'block';
    }
  };

  this.isGameOver = function(player) {
    if (this.board[0] === this.board[1] && this.board[1] === this.board[2] && this.board[0] === player) {
      return true;
    } else if (this.board[0] === this.board[3] && this.board[3] === this.board[6] && this.board[0] === player) {
      return true;
    } else if (this.board[0] === this.board[4] && this.board[4] === this.board[8] && this.board[0] === player) {
      return true;
    } else if (this.board[1] === this.board[4] && this.board[4] === this.board[7] && this.board[1] === player) {
      return true;
    } else if (this.board[2] === this.board[5] && this.board[5] === this.board[8] && this.board[2] === player) {
      return true;
    } else if (this.board[2] === this.board[4] && this.board[4] === this.board[6] && this.board[2] === player) {
      return true;
    } else if (this.board[3] === this.board[4] && this.board[4] === this.board[5] && this.board[3] === player) {
      return true;
    } else if (this.board[6] === this.board[7] && this.board[7] === this.board[8] && this.board[6] === player) {
      return true;
    } else if (this.availableCells.length === 0) {
      winnerstatus.innerHTML = "It's a draw...Better luck next time!";
      return false;
    }
    return false;
  };

  this.clearBoard = function() {
    this.board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.availableCells = ['0', '1', '2', '3', '4', '5', '6', '7', '8'];
    this.p1Cells = [];
    this.p2Cells = [];
    this.move = 0;
    this.aiturn = this.player === 'X' ? false : true;

    // clear board
    for (let i = 0; i < 9; i++) {
      const element = `box${i}`;
      document.querySelector(`#${element}`).innerHTML = '';
    }
  };

  this.restart = function() {
    this.waiting = false;
    this.clearBoard();
    winnerstatus.innerHTML = '';
    if (this.gameType === 'versus') {
      this.aiturn = false;
    } else if (this.computer === 'O') {
      this.aiturn = false;
    } else {
      this.aiturn = true;
      this.computerMoves();
    }
  };

  this.reset = function() {
    this.restart();
    // show the user the home menu again
    $('.grid').fadeOut(400);
    grid.style.display = 'none';
    menu.style.display = 'block';
  };

  this.nameSetup = function() {
    if (this.gameType === 'versus') {
      firstplayer.innerHTML = '1P [ X ]';
      secondplayer.innerHTML = '2P [ O ]';
    } else {
      firstplayer.innerHTML = `YOU [${this.player}]`;
      secondplayer.innerHTML = `BOT [${this.computer}]`;
    }
  };

  this.setBoard = function() {
    menu.style.display = 'none';
    $('.grid').fadeIn(400);
    grid.style.display = 'flex';
    if (this.computer === 'X' && this.aiturn && this.gameType === 'ai') {
      this.computerMoves();
    }
  };

  this.setup = function() {
    if (
      // ensure that our user has selected one of each option
      (playerselection.classList.contains('pselected') || computerselection.classList.contains('pselected')) &&
      (o.classList.contains('pselected') || x.classList.contains('pselected'))
    ) {
      // handle our user selection
      if (o.classList.contains('pselected')) {
        this.aiturn = true;
      } else if (x.classList.contains('pselected')) {
        this.aiturn = false;
      }
      this.assignLetter();
      this.nameSetup(); // update our board
      this.playerIndicator();
      this.setBoard();
    } else {
      // alert user they must select all options.
      setTimeout(() => {
        row.classList.add('shake');
      }, 1);
      row.classList.remove('shake');
    }
  };

  // game type
  computerselection.addEventListener('click', e => this.pcselection(e));
  playerselection.addEventListener('click', e => this.versus(e));

  // user selected letter
  o.addEventListener('click', e => {
    e.stopPropagation();
    if (e.target.classList.contains('pselected')) {
      e.target.classList.remove('pselected');
    } else {
      e.target.classList.add('pselected');
      x.classList.remove('pselected');
    }
  });

  x.addEventListener('click', e => {
    e.stopPropagation();
    if (e.target.classList.contains('pselected')) {
      e.target.classList.remove('pselected');
    } else {
      e.target.classList.add('pselected');
      o.classList.remove('pselected');
    }
  });

  $('.box').on('click', function() {
    // if box not filled
    // get id

    const cell = this.id.slice(-1);
    if (tictactoe.isAvailable(cell) && !tictactoe.waiting && !tictactoe.aiturn) {
      tictactoe.playerMoves(cell);
    } else if (tictactoe.isAvailable(cell) && tictactoe.gameType === 'versus' && tictactoe.aiturn) {
      tictactoe.playerTwoMoves(cell);
    }
  });

  start.addEventListener('click', e => this.setup(e));
  restart.addEventListener('click', e => this.restart(e));
  home.addEventListener('click', e => this.reset(e));
}
