pragma solidity  >=0.4.21 <0.7.0;


/// @title TicTacToe smart contract
/// @notice A game developed using solidity where two players can play for a game reward
contract TicTacToe {
    uint256 public constant gamePrice = 2 ether;

    uint8 public boardSize = 3;
    address[3][3] board;

    address public playerOneAddr;
    address public playerTwoAddr;

    /// @notice Constructor function
    constructor () public payable {
        require(msg.value >= 1, "in TicTacToe:constructor(). Value is less than 1 ether.");
        require(msg.sender != address(0), "in TicTacToe:constructor(). Caller is address(0).");
        playerOneAddr = msg.sender;
    }

    


    /// @notice Function that gets the board details
    function getBoard() public view returns (address[3][3]) {
        return board;
    }
}