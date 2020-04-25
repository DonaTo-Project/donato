pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./DonatoReceiver.sol";
import "./ERC20Mintable.sol";//MoonPayToken Contract

contract Donato is Ownable {
		
	//Contract settings:

	using SafeMath for uint;
  DonatoReceiver public newReceiver;

  address payable private _owner;
  address public tokenContractAddress;
  uint public index;
  uint public receiverCount;//Number of receivers created, also used as each receiver Id
  struct Candidate {
  	bool exists;
    string name;
    string category;
    string description;
    string country;
    string VAT;
	}

  mapping (address => Candidate) public candidatesList;
	address[] public pendingAddresses;
	mapping (address => uint) public pendingIndexList;
  mapping (address => address) public receiversContractAddresses;//List of receivers contract's addresses
  mapping (string => mapping (string => bool)) private countryVATList;//Mapping of VAT numbers per country, used to avoid double subscription with same VAT number

  //Events
  event ApplicationReceived(address candidateAddress, string name, string VAT);
  event ReceiverCreated(address candidateAddress, string name, string category, string description, string country, string VAT);

  constructor (address _tokenContractAddress) payable public {
    _owner = msg.sender;
    index = 0;
    receiverCount = 0;//Initialize receivers id count to 0
    tokenContractAddress = _tokenContractAddress;//Save DAI contract address sent as paramater
  }


  //Contract functions:

	function sendApplication(string calldata _name, string calldata _category, string calldata _description, string calldata _country, string calldata _VAT) external {
  	require(countryVATList[_country][_VAT] != true, "VAT number already used");
  	require(candidatesList[msg.sender].exists != true, "This address is already used in the pending list");

  	candidatesList[msg.sender] = Candidate(true, _name, _category, _description, _country, _VAT);
  	pendingIndexList[msg.sender] = index;
  	pendingAddresses.push(msg.sender);
  	index = index.add(1);

  	emit ApplicationReceived(msg.sender, _name, _VAT);
	}

	function getPendingAddresses() external view onlyOwner returns (address[] memory) {
		require(pendingAddresses.length > 0, "No pending addresses for the moment");
		return pendingAddresses;
	}

	function getPendingCandidateData(address _candidateAddress) external view onlyOwner returns(
		string memory name,
		string memory category,
		string memory description,
		string memory country,
		string memory VAT
	){
  	require(candidatesList[_candidateAddress].exists == true, "This address doesn't match with any pending candidate");
  	return (
  		candidatesList[_candidateAddress].name,
  		candidatesList[_candidateAddress].category,
  		candidatesList[_candidateAddress].description,
  		candidatesList[_candidateAddress].country,
  		candidatesList[_candidateAddress].VAT
  	);
	}

	function evaluateCandidate(address payable _candidateAddress, bool _validation) external onlyOwner{
  	require(candidatesList[_candidateAddress].exists == true, "This address doesn't match with any pending candidate");
 		if (_validation == true) {
  		newReceiver = new DonatoReceiver(
  			_candidateAddress,
  			candidatesList[_candidateAddress].name,
  			candidatesList[_candidateAddress].category,
  			candidatesList[_candidateAddress].description,
  			candidatesList[_candidateAddress].country,
  			candidatesList[_candidateAddress].VAT,
  			tokenContractAddress
  		);
  		receiverCount = receiverCount.add(1);
  		receiversContractAddresses[_candidateAddress] = address(newReceiver);
		}
		uint indexToDelete = pendingIndexList[_candidateAddress];
		delete pendingAddresses[indexToDelete];
		candidatesList[_candidateAddress].exists = false;
		emit ReceiverCreated(
			_candidateAddress,
			candidatesList[_candidateAddress].name,
			candidatesList[_candidateAddress].category,
			candidatesList[_candidateAddress].description,
			candidatesList[_candidateAddress].country,
			candidatesList[_candidateAddress].VAT
		);
	}
}