// SPDX-License-Identifier:GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract USDC is ERC20PresetMinterPauser("USDC", "USDC") {
    /**
     * @dev The constructor determines the initial supply of GTKN and assign them
     * to the deployer address
     *
     * @param initialSupply initial supply of GTKN with 18 decimals
     */
    constructor(uint256 initialSupply){
        mint(msg.sender, initialSupply);
    }

}