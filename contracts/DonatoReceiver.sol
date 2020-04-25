pragma solidity >=0.4.25 <0.7.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./TokenERC20Dai.sol";//Need DAI contract, this one is a test one

/// @title DonaToReceiver contract
/// @notice 
/// @dev 
contract DonatoReceiver is Ownable {
		
		//Contract settings:
			using SafeMath for uint;

	    address payable private _owner;

    	bool status;
      string name;
      string country;
      string nationalId;

      //Events
      event ReceiverWithdrawed(string receiverName, uint amountWithdrawed);

	    constructor (string memory _name, string memory _country, string memory _nationalId) payable public {
	      _owner = msg.sender;
	      status = true;
	      name = _name;
	      country = _country;
	      nationalId = _nationalId;
	    }

	    //Enable the contract to receive ETH (in case)
	    receive() external payable {}


	  //Contract functions:

	    //Send receiver's balance
	    function withdrawCall(address DAIContractAddress) external onlyOwner {

	    	//Instantiate DAI contract
	    	TokenERC20Dai TokenDAI = TokenERC20Dai(DAIContractAddress);
				uint256 DAIbalance = TokenDAI.balanceOf(address(this));
	    	require(DAIbalance > 0, "Receiver's balance is empty");
				
	      TokenDAI.transfer(_owner, DAIbalance);

	      emit ReceiverWithdrawed(name, DAIbalance);
	    }

}