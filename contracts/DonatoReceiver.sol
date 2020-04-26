pragma solidity ^0.5.0;

import "./SafeMath.sol";
import "./ERC20Mintable.sol";//MoonPayToken Contract

///@title DonatoReceiver
///@author Lorenzo Bersano and Raphael Pinto
///@notice This contract is used and created by Donato Dapp
///@dev All function calls are currently implemented without side effects
contract DonatoReceiver {

	using SafeMath for uint;

	address payable private donatoOwner;
  address payable private _owner;
  address tokenContractAddress;
	bool status;
  string name;
  string category;
  string description;
  string country;
  string VAT;

  ///Events
  event ReceiverWithdrawed(string receiverName, uint amountWithdrawed, string withdrawallReason);

  constructor (address payable _candidateAddress, string memory _name, string memory _category, string memory _description, string memory _country, string memory _VAT, address _tokenAddress) payable public {
    donatoOwner = msg.sender;
    _owner = _candidateAddress;
    tokenContractAddress = _tokenAddress;
    status = true;
    name = _name;
    category = _category;
    description = _description;
    country = _country;
    VAT = _VAT;
  }

  ///@notice Called by the candidate when he wants to receive the funds
  ///@dev Send token funds of the contracts to Donato Dapp for further conversion into fiat and transfer via regular fiat system
  ///@param _withdrawalReason The reason invoked by the candidate on why he needs to withdraw the funds
  function withdrawCall(string calldata _withdrawalReason) external {
    require(msg.sender != address(0), "Address 0 calling");
  	require(msg.sender == _owner, "Caller is not the owner");

  	ERC20Mintable TokenDAI = ERC20Mintable(tokenContractAddress);
		uint256 tokenbalance = TokenDAI.balanceOf(address(this));
  	require(tokenbalance > 0, "Receiver's balance is empty");
		
    TokenDAI.transfer(donatoOwner, tokenbalance);

    emit ReceiverWithdrawed(name, tokenbalance, _withdrawalReason);
  }
}