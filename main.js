'use strict';
/*
factory function createPlayer()
    -private
        -_name
        -_inputType
    -public
        -getName()
        -getInputType()
        -updateBoard(cellIndex)
            -IF gameboard.boardState[cellIndex] is empty
                -fill gameboard.boardState[cellIndex] in with _inputType
                -then change gameBoard.whosTurn to other player
            -ELSE error screen

module gameboard()
    -private
        -_whosTurn
    -public
        -boardState
        -nextTurn() change whosTurn
        -restartGame() resets boardState to 3 by 3 null array

function promptUser()
    -prompt user to enter name twice
        -let name1=window.prompt(),name2=window.prompt()
        -player1=createPlayer(...name1)

function cellClick(event)
    -check whos turn is it with gameboard.whosTurn()
    -updatePlayerBoard() for the current player
    -gameboard.editBoard(player1board,player2board)
    -checkVictory()

const winningCondition=[] // array of array of winning patterns

function checkVictory()
    -IF any playerBoard same as winningCondition, announce winner
    -ELSE checkDraw()

function checkDraw()
    -IF gameboard.returnBoard() returns a full board -- check for absence of null? --, announce draw
*/

// ----- factory function and modules -----
// player factory function
const createPlayer = (name, inputType) => {
    const _name = name;
    const _inputType = inputType;

    const getName = () => {
        return _name;
    }
    const getInputType = () => {
        return _inputType;
    }
    //if cell is empty, fill it in
    //else show error
    const updateBoard = (cellIndex) => {
        if (!gameboard.boardstate[cellIndex]) {
            gameboard.boardstate[cellIndex] = _inputType;
        }
        else {
            alert("Please click a cell thats empty!");
        }
    }

    return { getName, getInputType, updateBoard };
}

// gameboard module
const gameboard = (() => {
    let _whosTurn='x';

    let boardstate = [false, false, false, false, false, false, false, false, false];
    const currentTurn=()=>{
        return _whosTurn;
    }
    const nextTurn = () => {
        //ternary operator if _whosTurn==x then return o else return x
        _whosTurn = _whosTurn === "x" ? "o" : "x"
    }

    return { currentTurn,boardstate, nextTurn, restartGame };
})();


// ----- Event listener and function -----

let playerArr=[]; //storage for player object
window.addEventListener('DOMContentLoaded',init);

// create eventistener for each cell
let cells = document.querySelectorAll('.cell');
cells.forEach(element => {
    element.addEventListener('click', cellClick);
});

document.getElementById('restart-game').addEventListener('click',restartGame());

// prompt user for name after all content are loaded
function init() {
    const name1 = window.prompt("'x' player please enter your name!", "kris");
    const name2 = window.prompt("'o' player please enter your name!", "samuel");

    const player1 = createPlayer(name1, 'x');
    const player2 = createPlayer(name2, 'o');

    playerArr=[player1,player2];
}

function cellClick(event) {
    const playerTurn=gameboard.currentTurn();
    const cellIndex=this.getAttribute('data-cell-index');
    for(let i=0;i<playerArr.length;i++){
        if(playerArr[i].getInputType()===playerTurn){
            playerArr[i].updateBoard(cellIndex);
        }
    }
    updateDisplay(gameboard.boardstate,this);
    checkVictory();
    gameboard.nextTurn();
}

function updateDisplay(boardstate,that){
    for(let i=0;i<boardstate.length;i++){
        that.textContent=gameboard.currentTurn();
    }
}

const winningCondition=[
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
];

function checkVictory(){
    let xArr=gameboard.boardstate.slice(0);
    let oArr=gameboard.boardstate.slice(0);

    // create an arrays with just 'x' and another just 'o'
    for(let i=0;i<gameboard.boardstate.length;i++){
        if(gameboard.boardstate[i]==="o"){
            xArr[i]=false;
        }
        if(gameboard.boardstate[i]==="x"){
            oArr[i]=false;
        }
    }

    for(const i in winningCondition){
        let xPoints=0;
        let oPoints=0;
        for(const n in winningCondition[i]){
            const index=winningCondition[i][n];
            if(xArr[index]==="x"){
                xPoints++;
            }
            if(oArr[index]==="o"){
                oPoints++;
            }
        }
        if(xPoints===3){
            alert("x has won, please restart");
        }
        else if(oPoints===3){
            alert("y has won, please restart");
        }
    }
    checkDraw();
}

function checkDraw(){
    let fullness=0;
    for(let i=0;i<gameboard.boardstate.length;i++){
        if(!!gameboard.boardstate[i]){
            fullness++;
        }
    }
    if(fullness===9){
        alert("Its a DRAW!");
    }
}

function restartGame(){
    gameboard.boardstate=[false, false, false, false, false, false, false, false, false];
    updateDisplay();
}