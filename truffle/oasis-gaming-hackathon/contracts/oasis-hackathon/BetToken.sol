pragma solidity ^0.5.0;

import "../openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "../openzeppelin-solidity/contracts/token/ERC20/ERC20Mintable.sol";

contract BetToken is ERC20Detailed, ERC20Mintable {
    constructor (
        string memory _name, 
        string memory _symbol, 
        uint8 _decimals, 
        address _account, 
        uint256 _amount
    ) 
    public ERC20Detailed(_name, _symbol, _decimals) {
        mint(_account, _amount);
    }
}