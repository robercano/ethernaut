// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "../challenges/DoubleEntryPoint.sol";

contract DoubleEntryPointSolution is IDetectionBot {
    IForta public forta;
    address public vault;

    constructor(address fortaAddress, address vault_) public {
        forta = IForta(fortaAddress);
        vault = vault_;
    }

    function handleTransaction(address user, bytes calldata msgData) external override {
        bytes memory msgMatch = abi.encodeWithSignature(
            "delegateTransfer(address,uint256,address)",
            user,
            100 ether,
            vault
        );

        if (keccak256(msgData) == keccak256(msgMatch)) {
            forta.raiseAlert(user);
        }
    }
}
