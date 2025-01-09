// Gameboard()
// define a board
// define player turn() (validate and put a mark)
// define print a board()

function Gameboard() {
    const rows = 3;
    const columns = 3;
    let board = [];
    let winner = "";
    const message = document.querySelector(".message");

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell(
                document.querySelector(`#_${i}${j}`)
            ));
        }
    }
    console.log(board);

    const winCoordinates = [
        [[0,0],[1,0],[2,0]],
        [[0,1],[1,1],[2,1]],
        [[0,2],[1,2],[2,2]],
        [[0,0],[0,1],[0,2]],
        [[1,0],[1,1],[1,2]],
        [[2,0],[2,1],[2,2]],
        [[0,0],[1,1],[2,2]],
        [[2,0],[1,1],[0,2]]
    ]


    const winFunc = () => {
        let winner = "";
        winCoordinates.forEach((el) => {
            let innerWinner = winWin([
                getCellValue(0,el),
                getCellValue(1,el),
                getCellValue(2,el)
            ]);
            if (innerWinner !== "") {
                winner = innerWinner;
            }  
        })
        return winner;
    }

    /**
     * 
     * @param {Number} cellNumber 
     * @param {Array} cellData 
     * @returns String
     */
    const getCellValue = (cellNumber,cellData) => {
        let row = cellData[cellNumber][0];
        let column = cellData[cellNumber][1];
        return board[row][column].getValue();
    }

    /**
     * 
     * @param {Array<String>} values 
     * @returns String returns winner - x,o or empty string if no winner
     */
    const winWin = (values) => {
        if (everyCheck(values,"x")) {
            return "x";
        } 
        if (everyCheck(values,"o")) {
            return "o";
        }
        return "";
    }

    

    const everyCheck = (values,player) => {
        return values.every((el) => el === player)
    }

    const playerTurn = (row, column, player) => {
        const cellValue = board[row][column].getValue();
        if (cellValue !== "") return "again";
        board[row][column].putMark(player);
        return "ok";
    }

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    const clearBoard = () => {
        board.forEach((row) => row.forEach(((cell) => cell.clearCell())));
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { playerTurn, printBoard, winFunc, winner, message, clearBoard, board}
}

// Cell()
// define a default value
// define put a mark()
// define getValue()

/**
 * 
 * @param {HTMLElement} el 
 * @returns 
 */
function Cell(el) {
    let value = "";
    let element = el;
    element.addEventListener("click", () => {
        if (value !== "") {
            return;
        };
        game.playRound(element.getAttribute("row"),element.getAttribute("column"))
    })
    const putMark = (player) => {
        value = player;
        element.textContent = game.getActivePlayer().mark;
    };

    const clearCell = () => {
        value = "";
        element.textContent = "";
    };

    const getValue = () => value;

    return {
        putMark, getValue, element, clearCell
    };
}

// Gamecontroller()
// define users
// instantiate a board
// define switch active player()
// define get active player()
// define print new round()

function GameController(
    playerOneName = "Player one",
    playerTwoName = "Player two"
) {
    const board = Gameboard();
    const players = [
        {
            name: playerOneName,
            mark: "x"
        },
        {
            name: playerTwoName,
            mark: "o"
        }
    ];

    let activePlayer = players[0];

    const switchPlayers = () => activePlayer = activePlayer === players[0] ? players[1] : players[0];
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
    };

    const playRound = (row, column) => {
        if ( board.winner === "x" || board.winner === "o" ) {
            board.message.textContent = `The winner is ${board.winner}`;
            return;
        }
        let turn = board.playerTurn(row, column, getActivePlayer().mark);
        if (turn === "again") {
            printNewRound();
        } else {
            board.winner = board.winFunc();
            if ( board.winner === "x" || board.winner === "o" ) {
                board.printBoard();
                board.message.textContent = `The winner is ${board.winner}`;
                return;
            }
            switchPlayers();
            printNewRound();
        };
        tieTie();
        if (board.winner === "x" || board.winner === "o" ) {
            board.message.textContent = `The winner is ${board.winner}`;
            return;
        }
    };

    const endGame = () => {
        board.clearBoard();
        game = null;
        game = GameController();
        board.message.textContent = "";
    }

    const tieTie = () => {
        const boardWithCellValues = board.board.map((row) => row.map((cell) => cell.getValue()));
        boardRowValue0 = boardWithCellValues[0];
        boardRowValue1 = boardWithCellValues[1];
        boardRowValue2 = boardWithCellValues[2];
        const check  = (el) => el === "";
        if (boardRowValue0.some(check) === false && boardRowValue1.some(check) === false && boardRowValue2.some(check) === false) {
            board.winner = "DRUZHBA";
            board.message.textContent = `The winner is ${board.winner}`;
        };
    };

        let button = document.querySelector("BUTTON");
        button.addEventListener("click", () => {
            endGame();
        })


    printNewRound();

    return {
        playRound,
        getActivePlayer,
        board,
        endGame,
        tieTie,
    };
    };

    let game = GameController();

