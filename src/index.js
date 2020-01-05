import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

function SortButton(props) {
  return (
    <button className="sort-button" onClick={props.onClick}>
      {props.isAscending ? "Sort Descending" : "Sort Ascending"}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    );
  }

  renderBoard(numColumn, numRow) {
    let index = 0
    let table = []
    for (var i = 0; i < numColumn; i++) {
      let oneRow = []

      for (var j = 0; j < numRow; j++) {
        oneRow.push(this.renderSquare(index))
        index++
      }

      table.push(<div className="board-row" key={i}>{oneRow}</div>)
    }
    return <div>{table}</div>
  }

  render() {
    return  (
      this.renderBoard(3,3)
    )
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastSquare: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      isAscending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastSquare: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });

  }

  handleSortButton() {
    this.setState({
      isAscending: ! this.state.isAscending,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: 0 === (step % 2),
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const currentStep = this.state.stepNumber;
    const isAscending = this.state.isAscending;

    let moves = history.map( (step, move) => {
      let desc = move ?
        'Go to move #' + move + " - last location: " + convertColRow(step.lastSquare) :
        'Go to game start';

      return (
        <li key={move}>
          <button className={( currentStep === move ) ? 'currentMove' : null} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    // reverse moves if SortButton is Descending
    moves = isAscending ? moves : moves.slice(0).reverse()

    let status;
    if ( winner ) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <SortButton
              isAscending={isAscending}
              onClick={() => this.handleSortButton()}
            />
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function convertColRow(squareNum) {
  if ( 0 <= squareNum && 9 >= squareNum ) {
    let col = ( squareNum % 3 ) + 1;
    let row = Math.floor(squareNum/3) + 1;
    return `col ${col}, row ${row}, squareNum ${squareNum}`;
  } else {
    return null;
  }
}
