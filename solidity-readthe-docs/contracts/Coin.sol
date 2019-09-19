pragma solidity >=0.5.0 <0.7.0;

/// @title Coin
/// @author Balaji Shetty Pachai
/// @notice Simplest form of cryptocurrency. 
/// @notice Contract has some changes as compare to the one over here.
/// Reference: https://solidity.readthedocs.io/en/v0.5.11/introduction-to-smart-contracts.html#subcurrency-example
contract Coin {
    address public minter;
    mapping(address => uint256) public balances;
    event Sent(address from, address to, uint256 amount);

    modifier onlyMinter() {
        require(msg.sender == minter, "in Coin:onlyMinter(). Caller is not minter.");
        _;
    }

    /// @notice Constructor 
    constructor () public {
        require(msg.sender != address(0), "in Coin:constructor(). Caller cannot be address(0).");
        minter = msg.sender;
    }

    /// @notice Function to mint tokens and assign to the receiver address
    /// @param receiver Receiver account address
    /// @param amount Number of tokens to be minted and assigned to the receiver
    function mint(address receiver, uint256 amount) public onlyMinter {
        require(amount <= 1e60, "in Coin:mint(). Amount exceeds the upper limit.");
        balances[receiver] += amount;
    }

    /// @notice Sends an amount of existing coins from any caller to an address
    /// @param receiver Receiver account address
    /// @param amount Number of tokens to be sent
    function send(address receiver, uint256 amount) public {
        require(msg.sender != address(0), "in Coin:send(). Caller cannot be address(0).");
        require(balances[msg.sender] >= amount, "in Coin:send(). Caller has insufficient balance.");
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }


}