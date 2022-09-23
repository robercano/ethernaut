// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

interface INotifyable {
    function notify(uint256 amount) external;
}

interface IGoodSamaritan {
    function requestDonation() external returns (bool enoughBalance);
}

contract GoodSamaritanSolution is INotifyable {
    error NotEnoughBalance();

    function notify(uint256 amount) external pure override {
        if (amount == 10) {
            revert NotEnoughBalance();
        }
    }

    function requestDonation(address samaritan) external {
        IGoodSamaritan(samaritan).requestDonation();
    }
}
