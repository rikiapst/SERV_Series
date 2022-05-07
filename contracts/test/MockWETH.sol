// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../interfaces/IERC20.sol";

contract MockWETH is IERC20 {

    address owner;
    mapping  (address => uint256)  balances;
    uint256 supply;
    constructor(address _owner, uint256 _amount){
        owner = _owner;
        balances[owner] = _amount;
        supply = _amount;
    }

    function totalSupply() external override view returns (uint256){
        return supply;
    }   
    function balanceOf(address account) external override view returns (uint256){
        return balances[account];
    }
    function transfer(address to, uint256 amount) external override returns (bool){}
    //owner to ownerAddress
    function allowance(address ownerAddress, address spender) external override view returns (uint256){}
    function approve(address spender, uint256 amount) external override returns (bool){}
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external override returns (bool){
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }

}