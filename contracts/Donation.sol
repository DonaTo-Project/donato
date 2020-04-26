pragma solidity ^0.5.0;

import "./Ownable.sol";
import "./SafeMath.sol";
import "./DonatoReceiver.sol";
import "./AdminRole.sol";

///@title Donato
///@author Lorenzo Bersano and Raphael Pinto
///@notice This contract is used by Donato Dapp, to allow and manage collecting funds for NGO and SME
///@dev All function calls are currently implemented without side effects
contract Donato is Ownable, AdminRole {

	using SafeMath for uint;
  DonatoReceiver public newReceiver;

  address payable private _owner;
  address public tokenContractAddress;
  uint public pendingIndex;
  uint public activeIndex;

  struct Candidate {
  	bool exists;
    string name;
    string category;
    string description;
    string country;
    string VAT;
	}

	address[] public pendingAddresses;
  address[] public activeAddresses;
  mapping (address => Candidate) public candidatesList;
	mapping (address => uint) public pendingIndexList;
  mapping (address => uint) public activeIndexList;
  mapping (address => address) public receiversContractAddresses;//List of receivers contract's addresses
  mapping (string => mapping (string => bool)) private countryVATList;//Mapping of VAT numbers per country, used to avoid double subscription with same VAT number

  ///Events
  event ApplicationReceived(address candidateAddress, string name, string VAT);
  event ReceiverContractCreated(address candidateAddress, string name, string category, string description, string country, string VAT, address receiverContractAddress);

  constructor (address _tokenContractAddress) payable public {
    _owner = msg.sender;
    pendingIndex = 0;
    activeIndex = 0;
    tokenContractAddress = _tokenContractAddress;//Save DAI contract address sent as parameter
  }

  ///@notice Send an application to DonaTo Dapp to receive funds, the application is pending untill it's accepted or rejected
  ///@dev Save candidate data to a struct Candidate and save sender address to the pending address array
  ///@param _name The name of the company or association
  ///@param _category If it is a company, an association or an NGO
  ///@param _description Who they are and the reason why they need funds
  ///@param _country The country where they are located
  ///@param _VAT For identification, the fiscal code of the company or their VAT number
	function sendApplication(string calldata _name, string calldata _category, string calldata _description, string calldata _country, string calldata _VAT) external {
  	require(bytes(_name).length != 0 && bytes(_category).length != 0 && bytes(_country).length != 0 && bytes(_VAT).length != 0, "Name, Category, Country and VAT number can't be empty");
    require(countryVATList[_country][_VAT] != true, "VAT number already used");
  	require(candidatesList[msg.sender].exists != true, "This address is already used in the pending list");

  	candidatesList[msg.sender] = Candidate(true, _name, _category, _description, _country, _VAT);
  	pendingIndexList[msg.sender] = pendingIndex;
  	pendingAddresses.push(msg.sender);
  	pendingIndex = pendingIndex.add(1);
    countryVATList[_country][_VAT] = true;

  	emit ApplicationReceived(msg.sender, _name, _VAT);
	}

  ///@notice Get all the addresses of the candidates that are waiting for approval
  ///@dev Get all addresses contained inside pendingAddresses array, reject if array is empty
  ///@return pending addresses array
	function getPendingAddresses() external view onlyAdmin returns (address[] memory) {
		require(pendingAddresses.length > 0, "No pending addresses for the moment");
		return pendingAddresses;
	}

  ///@notice Get all the addresses of the candidates that are active
  ///@dev Get all addresses contained inside activeAddresses array, reject if array is empty
  ///@return active addresses array
  function getActiveAddresses() external view onlyAdmin returns (address[] memory) {
    require(activeAddresses.length > 0, "No active addresses for the moment");
    return activeAddresses;
  }  

  ///@notice Get the informations of a Candidate
  ///@dev Return candidate data contained in the struct, reject if candidate address is wrong
  ///@param _candidateAddress The address of the required candidate
  ///@return name The name of the candidate as a string
  ///@return category The category of the candidate as a string
  ///@return description The description of the candidate as a string
  ///@return country The country of the candidate as a string
  ///@return VAT The VAT of the candidate as a string
	function getCandidateData(address _candidateAddress) external view onlyAdmin returns(
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

  ///@notice Evaluate a candidate application, accept it or reject it
  ///@dev Use this function to accept or reject a candidate, address of the candidate will be added to activeAddress array if accepted and delete from pendingArray if accepted or rejected  
  ///@param _candidateAddress The address of the required candidate
  ///@param _validation Set to true to accept application or false to reject
	function evaluateCandidate(address payable _candidateAddress, bool _validation) external onlyAdmin{
    require(msg.sender != address(0), "Address 0 calling");
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

      activeIndexList[_candidateAddress] = activeIndex;
      activeAddresses.push(_candidateAddress);
      activeIndex = activeIndex.add(1);
  		
      receiversContractAddresses[_candidateAddress] = address(newReceiver);
      
      emit ReceiverContractCreated(
  			_candidateAddress,
  			candidatesList[_candidateAddress].name,
  			candidatesList[_candidateAddress].category,
  			candidatesList[_candidateAddress].description,
  			candidatesList[_candidateAddress].country,
  			candidatesList[_candidateAddress].VAT,
        address(newReceiver)
  		);
		}

		uint indexToDelete = pendingIndexList[_candidateAddress];
		delete pendingAddresses[indexToDelete];
		
	}
}