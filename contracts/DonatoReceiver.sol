pragma solidity >=0.4.25 <0.7.0;

import "./SafeMath.sol";
import "./TokenERC20Dai.sol";//Need DAI contract, this one is a test one

/// @title DonaToReceiver contract
/// @notice 
/// @dev 
contract DonatoReceiver {
		
		//Contract settings:
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

      //Events
      event ReceiverWithdrawed(string receiverName, uint amountWithdrawed);

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

	    //Enable the contract to receive ETH (in case)
	    receive() external payable {}


	  //Contract functions:

	    //Send receiver's balance
	    function withdrawCall() external {
	    	require(msg.sender == _owner, "Caller is not the owner");
	    	//Instantiate DAI contract
	    	TokenERC20Dai TokenDAI = TokenERC20Dai(tokenContractAddress);
				uint256 tokenbalance = TokenDAI.balanceOf(address(this));
	    	require(tokenbalance > 0, "Receiver's balance is empty");
				
	      TokenDAI.transfer(donatoOwner, tokenbalance);

	      emit ReceiverWithdrawed(name, tokenbalance);
	    }

}