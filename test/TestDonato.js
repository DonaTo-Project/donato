const { BN, ether, expectRevert } = require("@openzeppelin/test-helpers");
const { expect } = require("chai");
const Donato = artifacts.require("Donato");
const TokenERC20Dai = artifacts.require("TokenERC20Dai");
const DonatoReceiver = artifacts.require("DonatoReceiver");



contract("Donato", function(accounts){
    const donatoContractOwner = accounts[0];
    const receiver = accounts[1];
    const donator1 = accounts[2];
    const donator2 = accounts[3];
    const hacker = accounts[4];

    //Before each unit test  
    beforeEach(async function() {
        this.TokenERC20DaiInstance = await TokenERC20Dai.new({from: donator1});
        this.DonatoInstance = await Donato.new(this.TokenERC20DaiInstance.address, {from: donatoContractOwner});
    });


    //Test Donato meta data after creation
    it("Check Donato contract initial meta data", async function() {
        //Check ownership
        expect(await this.DonatoInstance.owner()).to.equal(donatoContractOwner);

        //Check initial receiver count = 0
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


    //Test sendApplication function
    it("Check sendApplication() function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

        const recipientAddress = await this.DonatoInstance.pendingAddresses.call(0);
        expect(recipientAddress).to.equal(receiver);

        const recipientStruct = await this.DonatoInstance.candidatesList.call(receiver);
        expect(recipientStruct.name).to.equal("Il Buono");
    });

    //Test getPendingAddress function
    it("Check getPendingAddresses() function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});
        await this.DonatoInstance.sendApplication("Croix Rouge", "NGO", "We help people", "France", "15989300547700489", {from: accounts[5]});

        const pendingAddressesArray = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
        expect(pendingAddressesArray[0]).to.equal(receiver);
        expect(pendingAddressesArray[1]).to.equal(accounts[5]);
    });

    //Test getPendingCandidateData function
    it("Check getPendingCandidateData() function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

        const pendingCandidateData = await this.DonatoInstance.getPendingCandidateData(receiver, {from: donatoContractOwner});
        expect(pendingCandidateData.name).to.equal("Il Buono");
        expect(pendingCandidateData.category).to.equal("SME");
        expect(pendingCandidateData.description).to.equal("Ristorante");
        expect(pendingCandidateData.country).to.equal("IT");
        expect(pendingCandidateData.VAT).to.equal("00547700489");
    });

    //Test evaluateCandidate function
    it("Check evaluateCandidate() function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

        //Save initial receiver count
        const initialReceiverCount = await this.DonatoInstance.receiverCount.call();

        await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});

        const afterReceiverCount = await this.DonatoInstance.receiverCount.call();
        expect(afterReceiverCount).to.be.bignumber.equal(initialReceiverCount.add(new BN('1')));

        const pendingAddressesArrayAfter = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
        expect(pendingAddressesArrayAfter[0]).to.equal('0x0000000000000000000000000000000000000000');
    });

    //Test receiverContract can receive DAI tokens
    it("Check sending DAI to receiver function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Ristorante", "IT", "00547700489", {from: receiver});

        await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});

        //Save receiver address
        const newReceiverContractAddress = await this.DonatoInstance.receiversContractAddresses.call(receiver);
        
        //Save initial DAI balance
        const initialReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);

        //Transfer DAI to receiver
        const fundAmount = new BN('50')
        await this.TokenERC20DaiInstance.transfer(newReceiverContractAddress, fundAmount, {from: donator1});

        //Save new DAI balance
        const afterReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);

        //Compare two balances
        expect(afterReceiverBalance).to.be.bignumber.equal(initialReceiverBalance.add(fundAmount));
    });


    //Test withdrawCall() function that send receiver funds to Donato owner
    it("Check withdrawCall() function", async function() {
        //Create receiver
        this.DonatoReceiverInstance = await DonatoReceiver.new(receiver, "La Campagnola", "SME", "Ristorante", "IT", "00547700489", this.TokenERC20DaiInstance.address, {from: donatoContractOwner});
        //Save receiver address
        const newReceiverContractAddress = await this.DonatoReceiverInstance.address;

        //Transfer DAI to receiver
        let fundAmount = new BN('50')
        await this.TokenERC20DaiInstance.transfer(newReceiverContractAddress, fundAmount, {from: donator1});

        //Save receiver and donatoContractOwner DAI balance
        let beforeWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);
        console.log("Receiver initial balance: ", parseInt(beforeWithdrawReceiverBalance), "DAI");
        let beforeWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
        console.log("Doanto owner initial balance: ", parseInt(beforeWithdrawDonatoBalance), "DAI");

        //Check owner only can call withdraw function
        await expectRevert(this.DonatoReceiverInstance.withdrawCall({from: hacker}),"Caller is not the owner");

        //Withdraw
        await this.DonatoReceiverInstance.withdrawCall({from: receiver});

        //Save DAI balance
        let afterWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);
        console.log("Receiver after balance: ", parseInt(afterWithdrawReceiverBalance), "DAI");
        let afterWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
        console.log("Donato owner after balance: ", parseInt(afterWithdrawDonatoBalance), "DAI");

        //Compare balances
        expect(afterWithdrawReceiverBalance).to.be.bignumber.equal(beforeWithdrawReceiverBalance.sub(fundAmount));
        expect(afterWithdrawDonatoBalance).to.be.bignumber.equal(beforeWithdrawDonatoBalance.add(fundAmount));
    });
});