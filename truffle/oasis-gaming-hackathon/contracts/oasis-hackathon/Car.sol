pragma solidity ^0.5.0;

import "../openzeppelin-solidity/contracts/token/ERC721/ERC721Enumerable.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/ERC721MetadataMintable.sol";
import "../openzeppelin-solidity/contracts/token/ERC721/ERC721Metadata.sol";

contract Car is ERC721Metadata, ERC721MetadataMintable, ERC721Enumerable {
    constructor(string memory _name, string memory _symbol) public ERC721Metadata(_name, _symbol){}

    function generateCarId(address _to, string memory _carDetails) public onlyMinter returns (bool) {
        uint carId = totalSupply();
        return mintWithTokenURI(_to, carId, _carDetails);
    }
}