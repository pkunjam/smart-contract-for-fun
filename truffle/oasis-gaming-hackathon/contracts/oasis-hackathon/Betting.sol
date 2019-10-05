pragma solidity ^0.5.0;

import "../openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "../openzeppelin-solidity/contracts/math/SafeMath.sol";

contract Betting is Ownable {

    using SafeMath for uint;

    uint public constant FRACTIONAL_RATE_SCALING_FACTOR = 10 ** 4;
    uint public constant DIVISIONAL_FACTOR = 10 ** 5;
    uint public commisionPercent = 20000;
    uint public profitPercent = 80000;
    uint public winner;

    mapping (address => mapping(uint => uint)) public betAmount;
    mapping(address => uint) public bettedFor;

    function bet(uint _id) public payable {
        require(msg.sender != address(0), "in Betting:bet(). Caller cannot be address zero.");
        require(msg.value > 0, "in Betting:bet(). Value cannot be zero.");
        betAmount[msg.sender][_id] = msg.value;
        bettedFor[msg.sender] = _id;
    }

    //TODO: @balaji make this Third Party Independent i.e. owner independent
    function finishRace(uint _winnerId) public onlyOwner {
        winner = _winnerId;
    }

    function withdraw() public {
        if (bettedFor[msg.sender] == winner) {
            uint amount = ((profitPercent * address(this).balance) / DIVISIONAL_FACTOR );
            msg.sender.transfer(amount);
        } else {
            revert();
        }
    }
}