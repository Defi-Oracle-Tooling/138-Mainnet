// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/ccip/applications/CCIPReceiver.sol";
import "@chainlink/contracts/src/v0.8/ccip/libraries/Client.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CCIPToken is CCIPReceiver, ERC20 {
    constructor(address router) CCIPReceiver(router) ERC20("CCIP Token", "CCIP") {
        _mint(msg.sender, 1000000 * 10**18);
    }

    function _ccipReceive(Client.Any2EVMMessage memory message) internal override {
        // Handle incoming CCIP messages
    }
}
