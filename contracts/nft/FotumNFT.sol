// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

//import "hardhat/console.sol";

contract FotumNFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address payable owner;

    mapping(uint256 => fotumNFT) private idToNFT;

    struct fotumNFT {
      uint256 tokenId;
      address payable owner;
      uint256 birthday;
    }

    event NFTCreated (
      uint256 indexed tokenId,
      address owner,
      uint256 birthday
    );

    constructor() ERC721("Fotum NFT", "Fotum NFT") {
      owner = payable(msg.sender);
    }

    /* Mints a new NFT */
    function createToken(string memory _tokenURI) public payable returns (uint) {
      _tokenIds.increment();
      uint256 newTokenId = _tokenIds.current();

      _mint(msg.sender, newTokenId);
      _setTokenURI(newTokenId, _tokenURI);
      return newTokenId;
    }

    /* Updates the URI of a given Token */
    function updateToken(string memory _newTokenURI, uint256 _tokenId) public {
        _setTokenURI(_tokenId, _newTokenURI);
    }

    /* Returns only items that a user has purchased */
   
}