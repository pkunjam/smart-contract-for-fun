pragma solidity ^0.5.0;

import "../openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";

contract Driver is ERC721Metadata, ERC721MetadataMintable, ERC721Enumerable {
    constructor(string memory _name, string memory _symbol) public ERC721Metadata(_name, _symbol){}
    
    function generateDriverId(address _to, string memory _driverDetails) public onlyMinter returns (bool) {
        uint driverId = totalSupply();
        return mintWithTokenURI(_to, driverId, _driverDetails);
    }
}