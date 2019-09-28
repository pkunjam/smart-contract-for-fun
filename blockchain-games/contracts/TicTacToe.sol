pragma solidity  >=0.4.21 <0.7.0;


/// @title TicTacToe smart contract
/// @author Balaji Shetty Pachai
/// @notice A game developed using solidity where two players can play for a game reward
contract TicTacToe {
    uint256 public constant gamePrice = 2 ether;

    uint8 public boardSize = 3;
    address[3][3] board;

    address public playerOneAddr;
    address public playerTwoAddr;

    address public gameWinner;

    bool public isDrawn;

    uint256 public moves;

    mapping (address=>uint256) public playerBalance;

    modifier onlyPlayers() {
        require(
            msg.sender == playerOneAddr || msg.sender == playerTwoAddr,
            "in TicTacToe:onlyPlayers(). Non-player cannot set stone."
        );
        _;
    }

    /// @notice Constructor function
    constructor () public payable {
        require(msg.value >= 1, "in TicTacToe:constructor(). Value is less than 1 ether.");
        require(msg.sender != address(0), "in TicTacToe:constructor(). Caller is address(0).");
        playerOneAddr = msg.sender;
        playerBalance[msg.sender] = msg.value;
    }

    


    

    /// @notice Function that allows other player to join the game
    /// such that any other player other than playerOne can join the game 
    /// by paying 1 ether
    function joinGame() public payable {
        require(msg.value >= 1, "in TicTacToe:joinGame(). Value is less than 1 ether.");
        require(msg.sender != address(0), "in TicTacToe:joinGame(). Caller is address(0).");
        require(msg.sender != playerOneAddr, "in TicTacToe:joinGame(). Same player cannot join twice.");
        playerTwoAddr = msg.sender;
        playerBalance[msg.sender] = msg.value;
    }


    /// @notice Function that marks the array indices with that of the player address
    /// This will take rowIndex and columnIndex as parameters
    /// and set either playerOne or playerTwo address in the board[][] address array at the rowIndex, clumnIndex
    /// Here multiple things should be taken care of
    /// As soon as a stone has been set, look out whether there is a winner or there is a draw
    function setStone(uint256 x, uint256 y) public onlyPlayers {
        bool isWinner = false;
        require(
            board[x][y] == address(0),
            "in TicTactToe:setStone(). Cannot set a stone at occupied spot."
        );
        board[x][y] = msg.sender;
        moves += 1;
        if (moves >= boardSize) {
            isWinner = checkForWinner(msg.sender);
        }

        if (isWinner) {
            gameWinner = msg.sender;
            // Update player balance
            if (msg.sender == playerOneAddr) {
                playerBalance[playerOneAddr] = playerBalance[playerOneAddr] + playerBalance[playerTwoAddr];
                playerBalance[playerTwoAddr] = 0;
            } else {
                playerBalance[playerOneAddr] = 0;
                playerBalance[playerTwoAddr] = playerBalance[playerOneAddr] + playerBalance[playerTwoAddr];
            }
        }

        // Checks for draw
        if (moves == (boardSize * boardSize) && !isWinner) {
            isDrawn = true;
        }
    }

    /// @notice Function that allows the players to withdraw their ethers
    function withdraw() public {
        msg.sender.transfer(playerBalance[msg.sender]);
    }

    ///@notice Function that returns the winner address
    function winner() public view returns (address) {
        return gameWinner;
    }

    ///@notice Functin that returns whether the game was a draw
    function hasTheGameDrawn() public view returns (bool) {
        return isDrawn;
    }

    /// @notice Function that gets the board details
    function getBoard() public view returns (address[3][3] memory) {
        return board;
    }

    /// @notice Function that checks for winner
    /// @param player Address that is being checked if it is the winner
    /// @return 
    function checkForWinner(address player) internal view returns (bool){
        if (checkRowForWinner(player)) {
            return true;
        } else if (checkColumnForWinner(player)) {
            return true;
        } else if (checkDiagonallyForWinner(player)) {
            return true;
        } else if (checkAntiDiagonallyForWinner(player)) {
            return true;
        } else {
            return false;
        }
    }

    /// @notice Function that checks whether the winner exists across a row
    /// @param player Address that is being checked if it is the winner
    function checkRowForWinner(address player) internal view returns (bool) {
        uint8 count = 0;
        for (uint8 i = 0; i < boardSize; i++) {
            for (uint8 j = 0; j < boardSize; j++) {
                if (board[i][j] == player) {
                    count += 1;
                } else {
                    break;
                }
            }
            if (isWinnerFound(count)) {
                return true;
            } else {
                count = 0;
            }
        }
        return false;
    }

    /// @notice Function that checks whether the winner exists across a column
    /// @param player Address that is being checked if it is the winner
    function checkColumnForWinner(address player) internal view returns (bool) {
        uint8 count = 0;
        for (uint8 i = 0; i < boardSize; i++) {
            for (uint8 j = 0; j < boardSize; j++) {
                if (board[j][i] == player) {
                    count += 1;
                } else {
                    break;
                }
            }
            if (isWinnerFound(count)) {
                return true;
            } else {
                count = 0;
            }
        }
        return false;
    }

    /// @notice Function that checks whether the winner exists diagonally
    /// @param player Address that is being checked if it is the winner
    function checkDiagonallyForWinner(address player) internal view returns (bool) {
        uint8 count = 0;
        for (uint8 i = 0; i < boardSize; i++) {
            if (board[i][i] == player) {
                count += 1;
            } else {
                break;
            }
        }
        return isWinnerFound(count);
    }

    /// @notice Function that checks whether the winner exists anti-diagonally
    /// @param player Address that is being checked if it is the winner
    function checkAntiDiagonallyForWinner(address player) internal view returns (bool) {
        uint8 count = 0;
        uint8 rowCount = 0;
        for (uint8 i = boardSize - 1; i >= 0; i--) {
            if (board[i][rowCount] == player) {
                rowCount += 1;
                count += 1;
            } else {
                break;
            }
        }
        return isWinnerFound(count);
    }

    /// @notice Compare count with boardSize,if both are equal return true else false
    function isWinnerFound(uint8 count) internal view returns (bool) {
        if (count == boardSize) {
            return true;
        } else {
            return false;
        }
    }
    
}