const { BN, ether, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Donato = artifacts.require("Donato");
const ERC20Mintable = artifacts.require("ERC20Mintable");
const DonatoReceiver = artifacts.require("DonatoReceiver");



contract("Donato", function(accounts){
    const donatoContractOwner = accounts[0];
    const receiver = accounts[1];
    const donator1 = accounts[2];
    const donator2 = accounts[3];
    const hacker = accounts[4];

    //Before each unit test  
    beforeEach(async function() {
        this.TokenERC20DaiInstance = await ERC20Mintable.new({from: donator1});
        this.DonatoInstance = await Donato.new(this.TokenERC20DaiInstance.address, {from: donatoContractOwner});
    });


    //Test Donato meta data after creation
    it("Check Donato contract initial meta data", async function() {
        //Check ownership
        expect(await this.DonatoInstance.owner()).to.equal(donatoContractOwner);

        //Check adminRole
        expect(await this.DonatoInstance.isAdmin(donatoContractOwner)).to.equal(true);

        //Check initial receiver count = 0 (constructor)
        const initialReceiverCount = await this.DonatoInstance.receiverCount.call();
        expect(initialReceiverCount).to.be.bignumber.equal(new BN('0'));
    });


    //Test Donato contract ownership can be transfered
    it("Check Donato contract transferOwnership() function", async function() {
        await this.DonatoInstance.transferOwnership(receiver, {from: donatoContractOwner});
        expect(await this.DonatoInstance.owner()).to.equal(receiver);

        //Verifying modifier is effective
        await expectRevert(this.DonatoInstance.transferOwnership(hacker, {from: hacker}),"Ownable: caller is not the owner");
    });


    //Test add new admin
    it("Check addAdmin() function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});
        const initialReceiverCount = await this.DonatoInstance.receiverCount.call();

        //Verifying onlyAdmin modifier
        await expectRevert(this.DonatoInstance.evaluateCandidate(receiver, true, {from: donator1}),"AdminRole: caller does not have the Admin role");

        //ADD donator1 as an admin and check that he can evaluateCandidate
        await this.DonatoInstance.addAdmin(donator1, {from: donatoContractOwner});
        await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donator1});

        //Verify evaluateCandidate function worked
        const afterReceiverCount = await this.DonatoInstance.receiverCount.call();
        expect(afterReceiverCount).to.be.bignumber.equal(initialReceiverCount.add(new BN('1')));
    });


    //Test sendApplication function
    it("Check sendApplication() function", async function() {
        //Verifying require no empty VAT field
        await expectRevert(this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "", {from: receiver}),"Name, Category, Country and VAT number can't be empty");
        
        //Verifying VAT number not already used
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});
        await expectRevert(this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: hacker}),"VAT number already used");

        //Verifying msg.sender address not already in the pending list
        await expectRevert(this.DonatoInstance.sendApplication("Il Buono (falso)", "SME", "Ristorante", "IT", "10547700489", {from: receiver}), "This address is already used in the pending list");

        const recipientStruct = await this.DonatoInstance.candidatesList.call(receiver);
        expect(recipientStruct.name).to.equal("Il Buono");

        const recipientAddress = await this.DonatoInstance.pendingAddresses.call(0);
        expect(recipientAddress).to.equal(receiver);
    });

    // //Test getPendingAddress function
    // it("Check getPendingAddresses() function", async function() {
    //     await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});
    //     await this.DonatoInstance.sendApplication("Croix Rouge", "NGO", "We help people", "France", "15989300547700489", {from: accounts[5]});

    //     const pendingAddressesArray = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
    //     expect(pendingAddressesArray[0]).to.equal(receiver);
    //     expect(pendingAddressesArray[1]).to.equal(accounts[5]);
    // });

    // //Test getPendingCandidateData function
    // it("Check getPendingCandidateData() function", async function() {
    //     await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

    //     const pendingCandidateData = await this.DonatoInstance.getPendingCandidateData(receiver, {from: donatoContractOwner});
    //     expect(pendingCandidateData.name).to.equal("Il Buono");
    //     expect(pendingCandidateData.category).to.equal("SME");
    //     expect(pendingCandidateData.description).to.equal("Ristorante");
    //     expect(pendingCandidateData.country).to.equal("IT");
    //     expect(pendingCandidateData.VAT).to.equal("00547700489");
    // });

    // //Test evaluateCandidate function
    // it("Check evaluateCandidate() function", async function() {
    //     await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

    //     //Save initial receiver count
    //     const initialReceiverCount = await this.DonatoInstance.receiverCount.call();

    //     await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});

    //     const afterReceiverCount = await this.DonatoInstance.receiverCount.call();
    //     expect(afterReceiverCount).to.be.bignumber.equal(initialReceiverCount.add(new BN('1')));

    //     const pendingAddressesArrayAfter = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
    //     expect(pendingAddressesArrayAfter[0]).to.equal('0x0000000000000000000000000000000000000000');
    // });


    // //Test getActiveAddress function
    // it("Check getActiveAddresses() function", async function() {
    //     await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});
    //     await this.DonatoInstance.sendApplication("Croix Rouge", "NGO", "We help people", "France", "15989300547700489", {from: accounts[5]});

    //     await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});
    //     await this.DonatoInstance.evaluateCandidate(accounts[5], true, {from: donatoContractOwner});

    //     const activeAddressesArray = await this.DonatoInstance.getActiveAddresses({from: donatoContractOwner});
    //     expect(activeAddressesArray[0]).to.equal(receiver);
    //     expect(activeAddressesArray[1]).to.equal(accounts[5]);
    // });


    // //Test receiverContract can receive DAI tokens
    // it("Check sending DAI to receiver function", async function() {
    //     await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

    //     await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});

    //     //Save receiver address
    //     const newReceiverContractAddress = await this.DonatoInstance.receiversContractAddresses.call(receiver);
        
    //     //Save initial DAI balance
    //     const initialReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);

    //     //Transfer DAI to receiver
    //     const fundAmount = new BN('50')
    //     await this.TokenERC20DaiInstance.transfer(newReceiverContractAddress, fundAmount, {from: donator1});

    //     //Save new DAI balance
    //     const afterReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);

    //     //Compare two balances
    //     expect(afterReceiverBalance).to.be.bignumber.equal(initialReceiverBalance.add(fundAmount));
    // });


    // //Test withdrawCall() function that send receiver funds to Donato owner
    // it("Check withdrawCall() function", async function() {
    //     //Create receiver
    //     this.DonatoReceiverInstance = await DonatoReceiver.new(receiver, "La Campagnola", "SME", "Ristorante", "IT", "00547700489", this.TokenERC20DaiInstance.address, {from: donatoContractOwner});
    //     //Save receiver address
    //     const newReceiverContractAddress = await this.DonatoReceiverInstance.address;

    //     //Transfer DAI to receiver
    //     let fundAmount = new BN('50')
    //     await this.TokenERC20DaiInstance.transfer(newReceiverContractAddress, fundAmount, {from: donator1});

    //     //Save receiver and donatoContractOwner DAI balance
    //     let beforeWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);
    //     console.log("Receiver initial balance: ", parseInt(beforeWithdrawReceiverBalance), "DAI");
    //     let beforeWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
    //     console.log("Doanto owner initial balance: ", parseInt(beforeWithdrawDonatoBalance), "DAI");

    //     //Check owner only can call withdraw function
    //     await expectRevert(this.DonatoReceiverInstance.withdrawCall({from: hacker}),"Caller is not the owner");

    //     //Withdraw
    //     await this.DonatoReceiverInstance.withdrawCall({from: receiver});

    //     //Save DAI balance
    //     let afterWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);
    //     console.log("Receiver after balance: ", parseInt(afterWithdrawReceiverBalance), "DAI");
    //     let afterWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
    //     console.log("Donato owner after balance: ", parseInt(afterWithdrawDonatoBalance), "DAI");

    //     //Compare balances
    //     expect(afterWithdrawReceiverBalance).to.be.bignumber.equal(beforeWithdrawReceiverBalance.sub(fundAmount));
    //     expect(afterWithdrawDonatoBalance).to.be.bignumber.equal(beforeWithdrawDonatoBalance.add(fundAmount));
    // });
});