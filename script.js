// Gameboard()
// define a board
// define player turn() (validate and put a mark)
// define print a board()

function Gameboard() {
    const rows = 3;
    const columns = 3;
    const board = [];
    let winner = "";

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

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

    return { playerTurn, printBoard, winFunc, winner}
}

// Cell()
// define a default value
// define put a mark()
// define getValue()

function Cell() {
    let value = "";

    const putMark = (player) => {
        value = player;
    };

    const getValue = () => value;

    return {
        putMark, getValue
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
        console.log(`${getActivePlayer().name}'s turn`);
    };

    const playRound = (row, column) => {
        if (board.winner !== "") {
            console.log("The winner is " + board.winner);
            return;
        }
        let turn = board.playerTurn(row, column, getActivePlayer().mark);
        if (turn === "again") {
            console.log(`${getActivePlayer().name} chose invalid cell, please try again`);
            printNewRound();
        } else {
            console.log(`${getActivePlayer().name} put ${getActivePlayer().mark} in row ${row} column ${column} `);
            board.winner = board.winFunc();
            if (board.winner !== "") {
                board.printBoard();
                console.log("The winner is " + board.winner);
                return;
            }
            switchPlayers();
            printNewRound();
        };
    };

    printNewRound();

    return {
        playRound,
        getActivePlayer
    };
    };

    const game = GameController();

