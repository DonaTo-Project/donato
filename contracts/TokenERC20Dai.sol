pragma solidity >=0.4.25 <0.7.0;

import "./ERC20.sol";
import "./Ownable.sol";

/// @title ALY ERC-20 contract
/// @author Raphael Pinto Gregorio
/// @notice Basic ERC-20 token based on OpenZepellin ERC-20 standard
/// @dev The token has all classic ERC-20 functions: totalSupply(), balanceOf(), transfer(), allowance(), approve(), transferFrom(). It has two decimals.
contract TokenERC20Dai is ERC20, Ownable {
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 public _totalSupply;
    address private _owner;
    uint256 private lastExecutionTime;

    constructor() public {
        name = "ERC20 Token Dai";
        symbol = "DAI";
        decimals = 2;
        _owner = msg.sender;
        lastExecutionTime = 0;
        
        _mint(msg.sender, 1000000);
    }

    function getTokens(uint256 amount) public {
        require(amount <= 100000, "Required amount must be less than 100000");
        uint256 executionTime = now;
        require(executionTime >= lastExecutionTime + 2 * 1 minutes, "Function can be called every two minutes only, wait");

        lastExecutionTime = now;
        _mint(msg.sender, amount);
    }
}