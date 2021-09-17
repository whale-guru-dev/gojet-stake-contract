// SPDX-License-Identifier: MIT

pragma solidity 0.8.3;

import './Ownable.sol';

contract AntiWhale is Ownable {
    uint256 public startDate;
    uint256 public endDate;
    uint256 public limitWhale;
    bool public antiWhaleActivated;

    function activateAntiWhale() public onlyOwner {
        require(antiWhaleActivated == false);
        antiWhaleActivated = true;
    }

    function deActivateAntiWhale() public onlyOwner {
        require(antiWhaleActivated == true);
        antiWhaleActivated = false;
    }

    function setAntiWhale(uint256 _startDate, uint256 _endDate, uint256 _limitWhale) public onlyOwner {
        startDate = _startDate;
        endDate = _endDate;
        limitWhale = _limitWhale;
        antiWhaleActivated = true;
    }

    function isWhale(uint256 amount) public view returns (bool) {
        if (
            msg.sender == owner() ||
            antiWhaleActivated == false ||
            amount <= limitWhale
        ) return false;

        if (block.timestamp >= startDate && block.timestamp <= endDate)
            return true;

        return false;
    }
}
