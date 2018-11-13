pragma solidity ^0.4.24;
 
import "../imports/openzeppelin-solidity/token/ERC20/StandardToken.sol";
import "../imports/openzeppelin-solidity/ownership/Ownable.sol";


contract MockDAI is StandardToken, Ownable {
    string public name = "DAI";
    string public symbol = "DAI";
    uint8 public decimals = 18;
    uint public initialSupply = 1000;

    constructor() public {
        totalSupply_ = initialSupply * (10**uint(decimals));
        balances[msg.sender] = totalSupply_;
    }
 
    function destroy() public onlyOwner {
        selfdestruct(owner);
    }
}