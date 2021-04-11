import React from 'react';

import '../index.css';
import Board from './Board.js';
import King from '../pieces/king';
import initialiseChessBoard from '../helpers/board-initializer';
import Highlight from '../pieces/highlight';

const _ = require('lodash');

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      squares: initialiseChessBoard(),
      player: 1,
      sourceSelection: -1,
      status: '',
      turn: 'white',
      possibleMovesArray: [],
      inCheck: false,
      winner: ''
    }
  }

  // removing highlight when an invalid destination selected
  removeHighlight(squares) {
    squares.map((sq, index) => {
      if(squares[index] !== null){
        if (squares[index].type === 'highlight') {
          squares[index] = null
        }
        else {
          squares[index].style = {...squares[index].style, backgroundColor: ""}
        }
      }
    })

    this.setState({
      squares: squares
    })
  }

  highlightDestinations(squares, i) {
    // loop through every square on board and check if isMovePossible returns true. IF its true, add that index to possibleMovesArry
    //try catch because some squares are null
    try {
      squares.map((sq, index) => {
        let isCurrentMovePossible = null;
       
        // separate for differen pieces since the isMovePossible params vary
        if (squares[i].type === 'pawn'){
           // if the square is not null and if its not occupied by own peice, only then proceed to check if movable
          if(squares[index]!== null && squares[index].player !== this.state.player) {
            // check if dest occupied by opponent, then possible to move 
            if(squares[index].player === (this.state.player === 1 ? 2 : 1) ) {
              isCurrentMovePossible = squares[i].isMovePossible(i, index, true);
            } 
            else { // else destination not occupied by opponent
              isCurrentMovePossible = squares[i].isMovePossible(i, index, false); // squares[i] represents the selected piece.   
            }

            if(isCurrentMovePossible) {
              this.state.possibleMovesArray.push(index);
            }
          }
          //if square is null then proceed to check if movable
          if(squares[index] === null) {
            isCurrentMovePossible = squares[i].isMovePossible(i, index, false); // squares[i] represents the selected piece. 
            if(isCurrentMovePossible) {
              this.state.possibleMovesArray.push(index);
            }
          }
        }
        else if(squares[i].type === 'bishop' || squares[i].type === 'queen' || squares[i].type === 'rook') {
          
          if(squares[index]!== null && squares[index].player !== this.state.player) {
            isCurrentMovePossible = squares[i].isMovePossible(i, index, squares);
            if(isCurrentMovePossible) {
              this.state.possibleMovesArray.push(index);
            }
          }

          if(squares[index] === null) {
            isCurrentMovePossible = squares[i].isMovePossible(i, index, squares); // squares[i] represents the selected piece. 
            if(isCurrentMovePossible) {
              this.state.possibleMovesArray.push(index);
            }
          }
        }
        else { //king and Knight
          if(squares[index]!== null && squares[index].player !== this.state.player) {
            isCurrentMovePossible = squares[i].isMovePossible(i, index);
            if(isCurrentMovePossible) {
              this.state.possibleMovesArray.push(index);
            }
          }
          if(squares[index] === null) {
            isCurrentMovePossible = squares[i].isMovePossible(i, index); // squares[i] represents the selected piece. 
            if(isCurrentMovePossible) {
              this.state.possibleMovesArray.push(index);
            }
          }

        }
      })


      // highlight all possible movalble squares
      this.state.possibleMovesArray.map((cell) => {

        // empty cells init a highlight class and apply background
        if(squares[cell] === null) {
          squares[cell] = new Highlight();
          squares[cell].style = {...squares[cell].style, backgroundColor: "RGBA(111,143,114, 0.58)"}
          this.setState(oldState => ({
            squares
          }))
        }

        // non empty cells just change the bG color
        if(squares[cell].player === (this.state.player === 1 ? 2 : 1)) {
          squares[cell].style = {...squares[cell].style, backgroundColor: "RGBA(111,143,114, 0.58)"}
        }

      })
    }
    catch {console.log('In catch')}

    console.log('Possible moves: ' + this.state.possibleMovesArray);
  }

  checkForCheckMate(squares) {
    // console.log('Square inside checkmate checker')
    // console.log(squares);
    let movePossible = null;
    let val = 1;
    squares.map((sq, i) => {
      if(sq !== null && sq.player === this.state.player) {
        // console.log('Inside: not anull sq and sq of same player. i: ' + i)
        squares.map((su, index) => {
          // movePossible = squares[i].isMovePossible(i, index, sq[i].type === 'pawn' ? (squares[index].player === (this.state.player === 1 ? 2 : 1) ? true : false) : (
          //   (sq[i].type === 'bishop' || sq[i].type === 'queen' || sq[i].type === 'rook' ? (squares) : null))
          // ))
          if (squares[i].type === 'pawn') {
            if(squares[index] === null) {
              // console.log('Index value square null. Index: ' + index)
              movePossible = squares[i].isMovePossible(i, index, false); // squares[i] represents the selected piece. 
              if(movePossible) {
                // console.log('Move possible from : ' + i+ " " + index)
                let tempSquares = _.clone(squares);
                tempSquares[index] = tempSquares[i];
                tempSquares[i] = null;
                // console.log('Temporarily moving to check if Check relieves')
                // console.log(tempSquares)

                if (this.isCheckForPlayer(tempSquares, this.state.player) === false) {
                  // console.log('Check came back false for temp squares')
                  // console.log(tempSquares)
                  val = 0
                  tempSquares = _.clone(squares);
                  return false //incase this temp move releases check, return from this function back to the function that called it
                }
                else {
                  tempSquares = _.clone(squares);
                }
              }
              // else {
              //   // console.log('Move NOT possible from: ' + i + " " + index)
              // }
            }
            else if (squares[index].player !== this.state.player) {
              // console.log('Index value square of opposite player. Index: ' + index)
              if (squares[index].player === (this.state.player === 1 ? 2: 1)) {
                movePossible = squares[i].isMovePossible(i, index, true);
              }
              else {
                movePossible = squares[i].isMovePossible(i, index, false);
              }
              if(movePossible) {
                // console.log('Move possible from : ' + i+ " " + index)
                let tempSquares = _.clone(squares);
                tempSquares[index] = tempSquares[i];
                tempSquares[i] = null;

                if (this.isCheckForPlayer(tempSquares, this.state.player) === false) {
                  // console.log('temp squares')
                  // console.log(tempSquares)
                  val = 0
                  tempSquares = _.clone(squares);
                  return false
                }
                else {
                  tempSquares = _.clone(squares);
                }
              }
              
              // else {
              //   // console.log('Move NOT possible from: ' + i+ " " + index)
              // }
            }
            
          }
          else if(squares[i].type === 'bishop' || squares[i].type === 'queen' || squares[i].type === 'rook') {
            if(squares[index] === null) {
              // console.log('Index value square null. Index: ' + index)
              movePossible = squares[i].isMovePossible(i, index, squares); // squares[i] represents the selected piece. 
              if(movePossible) {
                // console.log('Move possible from : ' + i+ " " + index)
                let tempSquares = _.clone(squares);
                tempSquares[index] = tempSquares[i];
                tempSquares[i] = null;
                // console.log('Temporarily moving to check if Check relieves')
                // console.log(tempSquares)

                if (this.isCheckForPlayer(tempSquares, this.state.player) === false) {
                  // console.log('Check came back false for temp squares')
                  // console.log(tempSquares)
                  val = 0
                  tempSquares = _.clone(squares);
                  return false
                }
                else {
                  tempSquares = _.clone(squares);
                }
              }
              // else {
              //   // console.log('Move NOT possible from: ' + i + " " + index)
              // }
            }
            else if(squares[index].player !== this.state.player) {
              // console.log('Index value square of opposite player. Index: ' + index)
              movePossible = squares[i].isMovePossible(i, index, squares);
              if(movePossible) {
                // console.log('Move possible from : ' + i+ " " + index)
                let tempSquares = _.clone(squares);
                tempSquares[index] = tempSquares[i];
                tempSquares[i] = null;

                if (this.isCheckForPlayer(tempSquares, this.state.player) === false) {
                  // console.log('temp squares')
                  // console.log(tempSquares)
                  val = 0
                  tempSquares = _.clone(squares);
                  return false
                }
                else {
                  tempSquares = _.clone(squares);
                }
              }
              else {
                // console.log('Move NOT possible from: ' + i+ " " + index)
              }
            }
  
            
          }
          else { //King and Knight
            if(squares[index] === null) {
              // console.log('Index value square null. Index: ' + index)
              movePossible = squares[i].isMovePossible(i, index); // squares[i] represents the selected piece. 
              if(movePossible) {
                // console.log('Move possible from : ' + i+ " " + index)
                let tempSquares = _.clone(squares);
                tempSquares[index] = tempSquares[i];
                tempSquares[i] = null;
                // console.log('Temporarily moving to check if Check relieves')
                // console.log(tempSquares)

                if (this.isCheckForPlayer(tempSquares, this.state.player) === false) {
                  // console.log('Check came back false for temp squares')
                  // console.log(tempSquares)
                  val = 0;
                  tempSquares = _.clone(squares);
                  return false //incase the next move releases check, return from this function back to the function that called it
                }
                else {
                  tempSquares = _.clone(squares);
                }
              }
              // else {
              //   // console.log('Move NOT possible from: ' + i + " " + index)
              // }
            }
            else if(squares[index].player !== this.state.player) {
              // console.log('Index value square of opposite player. Index: ' + index)
              movePossible = squares[i].isMovePossible(i, index);
              if(movePossible) {
                // console.log('Move possible from : ' + i+ " " + index)
                let tempSquares = _.clone(squares);
                tempSquares[index] = tempSquares[i];
                tempSquares[i] = null;

                if (this.isCheckForPlayer(tempSquares, this.state.player) === false) {
                  // console.log('temp squares')
                  // console.log(tempSquares)
                  val = 0
                  tempSquares = _.clone(squares);
                  return false //incase the next move releases check, return from this function back to the function that called it
                }
                else {
                  tempSquares = _.clone(squares);
                }
              }
              // else {
              //   // console.log('Move NOT possible from: ' + i+ " " + index)
              // }
            }
            
          }
        });
      }
    });
    if(val == 1) {
      return true
    }
    else {
      return false
    }
  }

  handleClick(i) {
    console.log(i)
    let squares = [...this.state.squares]; // just the squares no other state

    if (this.state.sourceSelection === -1) {

      // source clicked and hence highlight possible destinations here
      this.highlightDestinations(squares, i);

      //when you choose an empty cell show error
      if (!squares[i] || squares[i].player !== this.state.player) { 
        this.setState({ 
          status: "Wrong selection. Choose player " + this.state.player + " pieces." ,
          possibleMovesArray: []
        });
        this.removeHighlight(squares)
      }

      // valid cell
      else {
        squares[i].style = { ...squares[i].style, backgroundColor: "RGBA(111,143,114, 0.58)" }; //highlight cell onclicking it
        if(this.state.possibleMovesArray.length !== 0) {
          this.setState({
            status: "Choose destination for the selected piece",
            sourceSelection: i
          })
        }
      }
      return
    }

    // resetting possiblemovesarry after destination clicked
    // remove highlight configs since destination clicked. 
    
      this.state.possibleMovesArray.map((sq) => {
        if(!squares[sq].player) {
          squares[sq] = null
        }
      });
  
      this.setState(oldState => ({
        squares
      }))
      
      
      //check if this is the right placement
      this.setState({
        possibleMovesArray: []
      })
    // remove background color from src when destination selected
    squares[this.state.sourceSelection].style = { ...squares[this.state.sourceSelection].style, backgroundColor: "" };

    // if the square selected for destination is a square of the same player, then reject
    if (squares[i] && squares[i].player === this.state.player) { 
      this.setState({
        status: "Wrong selection. Choose valid source and destination again.",
        sourceSelection: -1,
      });
      this.removeHighlight(squares);
    }

    else {
      const isDestEnemyOccupied = Boolean(squares[i]); // boolean value of null is false
      let isMovePossible = false

      //check king /knight implememntation pending
      if(squares[this.state.sourceSelection].type === 'bishop' || squares[this.state.sourceSelection].type === 'queen' || squares[this.state.sourceSelection].type === 'rook' ) {
        isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, squares);
      }
      else {
        isMovePossible = squares[this.state.sourceSelection].isMovePossible(this.state.sourceSelection, i, isDestEnemyOccupied);  
      }
      
      if (isMovePossible) {

        // temporarily move to check for Check, if in Check invalidate moves that dont free from Check

        let tempSquares = _.clone(squares);

        tempSquares[i] = tempSquares[this.state.sourceSelection];
        tempSquares[this.state.sourceSelection] = null;

        
        if(this.isCheckForPlayer(tempSquares, this.state.player) === true) {

          this.setState( {
            status: 'Move not allowed. Still in Check',
            squares: squares
          } )

          if(this.checkForCheckMate(squares)) {
            this.setState( {
              status: 'CheckMate',
              squares: squares,
              winner: this.state.turn === 'white' ? 'Black' : 'White'
            } )

            // this.setState({
            //   squares: initialiseChessBoard(),
            //   player: 1,
            //   sourceSelection: -1,
            //   status: 'New game',
            //   turn: 'white',
            //   possibleMovesArray: [],
            //   inCheck: false
            // })
          }

        }
        else {
          let player = this.state.player === 1 ? 2 : 1;
          let turn = this.state.turn === 'white' ? 'black' : 'white';
          squares = tempSquares;
          // console.log('Squares updated with changes');
          // console.log(squares);
          this.setState(oldState => ({
            sourceSelection: -1,
            squares,
            player,
            status: '',
            turn,
            inCheck: false
          }));
        }

      }
      else {
        this.setState({
          status: "Wrong selection. Choose valid source and destination again.",
          sourceSelection: -1,
        });
        this.removeHighlight(squares);
      }
    }
  }

  getKingPosition(squares, player) {
    return squares.reduce((acc, curr, i) =>
      acc || //King may be only one, if we had found it, returned his position
      ((curr //current squre mustn't be a null
        && (curr.getPlayer() === player)) //we are looking for aspecial king 
        && (curr instanceof King)
        && i), // returned position if all conditions are completed
      null)
  }

  isCheckForPlayer(squares, player) {
    const opponent = player === 1 ? 2 : 1
    const playersKingPosition = this.getKingPosition(squares, player)
    const canPieceKillPlayersKing = (piece, i) => piece.isMovePossible(playersKingPosition, i, squares)
    return squares.reduce((acc, curr, idx) =>
      acc ||
      (curr &&
        (curr.getPlayer() === opponent) &&
        canPieceKillPlayersKing(curr, idx)
        && true),
      false)
  }


  render() {

    const winner = "Winner is ";

    return (
      <div className="main-cont">
        <div className="game">
        <div className="game-status top">
          CHESS
        </div>
          <div className="game-board">
            <Board
              squares={this.state.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="row">
            <h3 className="turntext">Turn - </h3>
            <div id="player-turn-box" style={{ backgroundColor: this.state.turn }}>

            </div>
            <button className="btn btn-primary reset" onClick={() => {this.setState({
              squares: initialiseChessBoard(),
              player: 1,
              sourceSelection: -1,
              status: '',
              turn: 'white',
              possibleMovesArray: [],
              inCheck: false
            })}}>Reset</button>
            </div>
            <div className="game-status">{this.state.status}</div>
            <div className="game-status">{
              this.state.winner !== '' ? winner + this.state.winner : null  
            }</div>
           
          </div>
        </div>
</div>
      

    );
  }
}
