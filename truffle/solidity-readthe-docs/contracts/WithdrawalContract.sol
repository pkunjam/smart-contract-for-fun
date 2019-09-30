pragma solidity >=0.4.22 <0.7.0;

/// @title A contract showing the withdrawal pattern
/// @notice It depicts the recommended common pattern that should be followed in case of withdrawal
contract WithdrawalContract {
    address public richest;
    uint public mostSent;

    mapping(address => uint256) public pendingWithdrawals;

    constructor() public payable {
        richest = msg.sender;
        mostSent = msg.value;
        pendingWithdrawals[richest] = mostSent;
    }

    /// @notice Function that changes the richest 
    function becomeRichest() public payable returns (bool) {
        require(msg.sender != address(0), "in WithdrawalContract:becomeRichest(). Caller cannot be address zero.");
        if (msg.value > mostSent) {
            richest = msg.sender;
            mostSent = msg.value;
            pendingWithdrawals[richest] = mostSent;
            return true;
        } else {
            return false;
        }
    }

    /// @notice Function that withdraws ether from the contract of the concerned user
    function withdraw() public {
        require(msg.sender != address(0), "in WithdrawalContract:withdraw(). Caller cannot be address zero.");
        uint256 amount = pendingWithdrawals[msg.sender];
        pendingWithdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }
}