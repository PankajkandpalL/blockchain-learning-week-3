// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "Ownable.sol";

contract AdvancedToken is Ownable {
    mapping(address => uint256) private _lockedBalances;
    mapping(address => uint256) private _lockTimestamps;

    uint256 private _maxSupply;

    event TokensLocked(address indexed user, uint256 amount, uint256 lockDuration);
    event TokensUnlocked(address indexed user, uint256 amount);
    event MaxSupplyChanged(uint256 newMaxSupply);

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_,
        uint256 maxSupply_
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply_);
        _maxSupply = maxSupply_;
    }

    function lockTokens(address user, uint256 amount, uint256 lockDuration) external onlyOwner {
        require(balanceOf(user) >= amount, "Not enough balance to lock");
        _lockedBalances[user] += amount;
        _lockTimestamps[user] = block.timestamp + lockDuration;
        emit TokensLocked(user, amount, lockDuration);
    }

    function unlockTokens(address user) external {
        require(_lockedBalances[user] > 0, "No tokens locked");
        require(block.timestamp >= _lockTimestamps[user], "Tokens are still locked");
        uint256 amount = _lockedBalances[user];
        _lockedBalances[user] = 0;
        _transfer(address(this), user, amount);
        emit TokensUnlocked(user, amount);
    }

    function mint(address account, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= _maxSupply, "Exceeds max supply");
        _mint(account, amount);
    }

    // reducing total supply here
    function burn(uint256 amount) external {
        require(_lockedBalances[msg.sender] == 0, "Cannot burn locked tokens");
        _burn(msg.sender, amount);
    }

    function getMaxSupply() external view returns (uint256) {
        return _maxSupply;
    }

    function changeMaxSupply(uint256 newMaxSupply) external onlyOwner {
        require(newMaxSupply >= totalSupply(), "New max supply must be greater than or equal to current total supply");
        _maxSupply = newMaxSupply;
        emit MaxSupplyChanged(newMaxSupply);
    }

    function lockedBalanceOf(address user) external view returns (uint256) {
        return _lockedBalances[user];
    }

    function lockTimestampOf(address user) external view returns (uint256) {
        return _lockTimestamps[user];
    }
}
