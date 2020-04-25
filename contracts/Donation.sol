pragma solidity >=0.4.25 <0.7.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./DonatoReceiver.sol";
import "./TokenERC20Dai.sol";//Need DAI contract, this one is a test one


contract Donato is Ownable {
		
		//Contract settings:
			using SafeMath for uint;

	    address payable private _owner;
	    uint public receiverCount;//Number of receivers created, also used as each receiver Id
	    address public DAIContractAddress;
	    // address public receiverAddress;

	    DonatoReceiver public newReceiver;

	    //List of receivers
	    mapping (uint => DonatoReceiver) public receiversAddresses;
	    // mapping (uint => address) public receiversAddresses;
	    
	    //List of National Id numbers per country already given to avoid double subscription with same National Id number
	    mapping (string => mapping (string => bool)) private countryNationalIdList;

	    //Events
	    event ReceiverCreated(uint receiverId, string name, string country, string nationalId);
	    // event ReceiverDeactivated(uint receiverId, bool status);
	    // event ReceiverReactivated(uint receiverId, bool status);

	    constructor (address _DAIContractAddress) payable public {
	      _owner = msg.sender;

	      //Initialize receivers id count to 0
	      receiverCount = 0;

	      //Save DAI contract address sent as paramater
	      DAIContractAddress = _DAIContractAddress;
	    }

	    //Enable the contract to receive ETH (in case)
	    receive() external payable {}



    //Contract functions:

	    //Creates a receiver struct with all parameters
	    function createReceiver(string calldata _name, string calldata _country, string calldata _nationalId) external onlyOwner {
	    	require(countryNationalIdList[_country][_nationalId] != true, "National Id already used");

	    	//Increment receiverCount
	    	receiverCount = receiverCount.add(1);

	    	//Create new DonatoReceiver contract
	    	newReceiver = new DonatoReceiver(_name, _country, _nationalId);

	    	//Add new contract to mapping
	    	// receivers[receiverCount] = newReceiver;

	    	//Add new contract address to mapping
	    	receiversAddresses[receiverCount] = newReceiver;

	    	//Save country X national id combination	
	    	countryNationalIdList[_country][_nationalId] = true;

	    	//Emit event
	    	emit ReceiverCreated(receiverCount, _name, _country, _nationalId);
	    }


	    //Send all receiver data
	    function getReceiverAddress(uint _receiverId) view external returns(DonatoReceiver receiverInformations) {
	    	require(_receiverId <= receiverCount, "Receiver Id doesn't exists");

	    	return (receiversAddresses[_receiverId]);
	    }


	    //Return receiver's balance
	   //  function getReceiverBalance(uint _receiverId) view external returns(uint receiverBalance){
	   //  	require(_receiverId <= receiverCount, "Receiver Id doesn't exists");

	   //  	//Instantiate DAI contract
	   //  	TokenERC20Dai TokenDAI = TokenERC20Dai(DAIContractAddress);
				// uint256 DAIbalance = TokenDAI.balanceOf(receiversAddresses[_receiverId]);

	   //  	return DAIbalance;
	   //  }


	    // //Return receiver's status
	    // function getReceiverStatus(uint _receiverId) external view returns(bool) {
	    // 	require(_receiverId >= receiverCount, "Receiver Id doesn't exist");

	    // 	return receivers[_receiverId].status; 
	    // }


	    // //Set receiver's status to false
	    // function deactivateReceiver(uint _receiverId) external onlyOwner {
	    // 	require(receivers[_receiverId].status != false, "This receiver is already unactive");
	    // 	receivers[_receiverId].status = false;

	    // 	emit ReceiverDeactivated(_receiverId, receivers[_receiverId].status);
	    // }


	    // //Set receiver's status to true
	    // function reactivateReceiverAgain(uint _receiverId) external onlyOwner {
	    // 	require(receivers[_receiverId].status == false, "This receiver is already active");
	    // 	receivers[_receiverId].status = true;

	    // 	emit ReceiverReactivated(_receiverId, receivers[_receiverId].status);
	    // }
}