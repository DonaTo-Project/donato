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
        let initialReceiverCount = await this.DonatoInstance.receiverCount.call();
        expect(initialReceiverCount).to.be.bignumber.equal(new BN('0'));
    });


    //Test Donato contract ownership can be transfered
    it("Check Donato contract transferOwnership() function", async function() {
        await this.DonatoInstance.transferOwnership(receiver, {from: donatoContractOwner});
        expect(await this.DonatoInstance.owner()).to.equal(receiver);

        //Verifying modifier is effective
        await expectRevert(this.DonatoInstance.transferOwnership(hacker, {from: hacker}),"Ownable: caller is not the owner");
    });


    //Test createReceiver function
    it("Check createReceiver() function", async function() {
        //Save initial receiver count
        let initialReceiverCount = await this.DonatoInstance.receiverCount.call();

        //Create receiver
        await this.DonatoInstance.createReceiver("La Campagnola", "Italy", "00547700489", {from: donatoContractOwner});
        let afterReceiverCount = await this.DonatoInstance.receiverCount.call();

        //Check receiver count incrementation after creation
        expect(afterReceiverCount).to.be.bignumber.equal(initialReceiverCount.add(new BN('1')));

        let newReceiverAddress = await this.DonatoInstance.receiversAddresses.call(1);
        console.log("DonatoReceiver created at: ",newReceiverAddress);

        //Check impossible use of same National Id number for creation
        await expectRevert(this.DonatoInstance.createReceiver("La Campagnola2", "Italy", "00547700489", {from: donatoContractOwner}),"National Id already used");
    });


    //Test get Receiver address function
    it("Check getReceiverAddress() function", async function() {
        //Create receiver
        await this.DonatoInstance.createReceiver("La Campagnola", "Italy", "00547700489", {from: donatoContractOwner});

        let receiverAddress = await this.DonatoInstance.getReceiverAddress(1);
        console.log(receiverAddress);
    });


    //Test receiver can receive DAI tokens
    it("Check sending DAI to receiver and getReceiverBalance() function", async function() {
        //Create receiver
        await this.DonatoInstance.createReceiver("La Campagnola", "Italy", "00547700489", {from: donatoContractOwner});
        //Save receiver address
        let newReceiverAddress = await this.DonatoInstance.receiversAddresses.call(1);
        
        //Save initial DAI balance
        let initialReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverAddress);

        //Transfer DAI to receiver
        let fundAmount = new BN('50')
        await this.TokenERC20DaiInstance.transfer(newReceiverAddress, fundAmount, {from: donator1});

        //Save new DAI balance
        let afterReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverAddress);

        //Compare two balances
        expect(afterReceiverBalance).to.be.bignumber.equal(initialReceiverBalance.add(fundAmount));
    });


    //Test withdrawCall() function that send receiver funds to Donato owner
    it("Check withdrawCall() function", async function() {
        //Create receiver
        this.DonatoReceiverInstance = await DonatoReceiver.new("La Campagnola", "Italy", "00547700489", {from: donatoContractOwner});
        //Save receiver address
        const newReceiverAddress = await this.DonatoReceiverInstance.address;

        //Transfer DAI to receiver
        let fundAmount = new BN('50')
        await this.TokenERC20DaiInstance.transfer(newReceiverAddress, fundAmount, {from: donator1});

        //Save receiver and donatoContractOwner DAI balance
        let beforeWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverAddress);
        console.log("Receiver initial balance: ", parseInt(beforeWithdrawReceiverBalance), "DAI");
        let beforeWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
        console.log("Doanto owner initial balance: ", parseInt(beforeWithdrawDonatoBalance), "DAI");

        //Check owner only can call withdraw function
        await expectRevert(this.DonatoReceiverInstance.withdrawCall(this.TokenERC20DaiInstance.address, {from: hacker}),"Ownable: caller is not the owner");

        //Withdraw
        await this.DonatoReceiverInstance.withdrawCall(this.TokenERC20DaiInstance.address, {from: donatoContractOwner});

        //Save DAI balance
        let afterWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverAddress);
        console.log("Receiver after balance: ", parseInt(afterWithdrawReceiverBalance), "DAI");
        let afterWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
        console.log("Donato owner after balance: ", parseInt(afterWithdrawDonatoBalance), "DAI");

        //Compare balances
        expect(afterWithdrawReceiverBalance).to.be.bignumber.equal(beforeWithdrawReceiverBalance.sub(fundAmount));
        expect(afterWithdrawDonatoBalance).to.be.bignumber.equal(beforeWithdrawDonatoBalance.add(fundAmount));
    });


    // //Test the 3 receiver status functions
    // it("Check getReceiverStatus(), deactivateReceiver() and reactivateReceiverAgain() function", async function() {
        
    //     //Create receiver
    //     await this.DonatoInstance.createReceiver(receiver, "SME", "La Campagnola", "Villa San Cipriano, 18", "Amatrice", "Italy", "00547700489", {from: donatoContractOwner});
    //     let receiverStatus = await this.DonatoInstance.getReceiverStatus(1);
    //     expect(receiverStatus).to.equal(true);

    //     await this.DonatoInstance.deactivateReceiver(1);
    //     receiverStatus = await this.DonatoInstance.getReceiverStatus(1);
    //     expect(receiverStatus).to.equal(false);

    //     await this.DonatoInstance.reactivateReceiverAgain(1);
    //     receiverStatus = await this.DonatoInstance.getReceiverStatus(1);
    //     expect(receiverStatus).to.equal(true);
    // });

});