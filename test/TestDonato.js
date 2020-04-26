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


    //Test 1
    it("Check Donato contract initial meta data", async function() {
        //Check ownership
        expect(await this.DonatoInstance.owner()).to.equal(donatoContractOwner);

        //Check adminRole
        expect(await this.DonatoInstance.isAdmin(donatoContractOwner)).to.equal(true);

        //Check initialized constructor ok
        const initialpendingIndex = await this.DonatoInstance.pendingIndex.call();
        expect(initialpendingIndex).to.be.bignumber.equal(new BN('0'));
        const initialTokenContractAddress = await this.DonatoInstance.tokenContractAddress.call();
        expect(initialTokenContractAddress).to.equal(this.TokenERC20DaiInstance.address);
    });


    //Test 2
    it("Check Donato contract transferOwnership() function", async function() {
        await this.DonatoInstance.transferOwnership(receiver, {from: donatoContractOwner});
        expect(await this.DonatoInstance.owner()).to.equal(receiver);

        //Verifying modifier is effective
        await expectRevert(this.DonatoInstance.transferOwnership(hacker, {from: hacker}),"Ownable: caller is not the owner");
    });


    //Test 3
    it("Check addAdmin() function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});

        //Verifying onlyAdmin modifier
        await expectRevert(this.DonatoInstance.evaluateCandidate(receiver, true, {from: donator1}),"AdminRole: caller does not have the Admin role");

        //ADD donator1 as an admin and check that he can evaluateCandidate
        await this.DonatoInstance.addAdmin(donator1, {from: donatoContractOwner});
        await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donator1});

        //Verify evaluateCandidate function worked
        const activeAddressesArray = await this.DonatoInstance.getActiveAddresses({from: donatoContractOwner});
        expect(activeAddressesArray[0]).to.equal(receiver);
    });


    //Test 4
    it("Check sendApplication() function", async function() {
        //Verifying require no empty VAT field
        await expectRevert(this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "", {from: receiver}),"Name, Category, Country and VAT number can't be empty");
        
        //Verifying VAT number not already used
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});
        await expectRevert(this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: hacker}),"VAT number already used");

        //Verifying msg.sender address not already in the pending list
        await expectRevert(this.DonatoInstance.sendApplication("Il Buono (falso)", "SME", "Rebuild ristorante", "IT", "10547700489", {from: receiver}), "This address is already used in the pending list");

        //Checking candidate data properly saved
        const recipientStruct = await this.DonatoInstance.candidatesList.call(receiver);
        expect(recipientStruct.name).to.equal("Il Buono");

        //Checking recipient address correctly saved in the pending address array
        const recipientAddress = await this.DonatoInstance.pendingAddresses.call(0);
        expect(recipientAddress).to.equal(receiver);
    });

    //Test 5
    it("Check getPendingAddresses() function", async function() {
        //Check revert if no addresses
        await expectRevert(this.DonatoInstance.getPendingAddresses({from: donatoContractOwner}), "No pending addresses for the moment");

        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});
        await this.DonatoInstance.sendApplication("Croix Rouge", "NGO", "We help people", "France", "15989300547700489", {from: accounts[5]});

        //Verifying pending addresses array filled correctly
        const pendingAddressesArray = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
        expect(pendingAddressesArray[0]).to.equal(receiver);
        expect(pendingAddressesArray[1]).to.equal(accounts[5]);
    });

    //Test 6
    it("Check getActiveAddresses() function", async function() {
        //Check revert if no addresses
        await expectRevert(this.DonatoInstance.getActiveAddresses({from: donatoContractOwner}), "No active addresses for the moment");

        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});
        await this.DonatoInstance.sendApplication("Croix Rouge", "NGO", "We help people", "France", "15989300547700489", {from: accounts[5]});

        await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});
        await this.DonatoInstance.evaluateCandidate(accounts[5], true, {from: donatoContractOwner});

        //Verifying active addresses array filled correctly
        const activeAddressesArray = await this.DonatoInstance.getActiveAddresses({from: donatoContractOwner});
        expect(activeAddressesArray[0]).to.equal(receiver);
        expect(activeAddressesArray[1]).to.equal(accounts[5]);
    });

    //Test 7
    it("Check getCandidateData() function", async function() {
        //Check revert if wrong address
        await expectRevert(this.DonatoInstance.getCandidateData(receiver, {from: donatoContractOwner}), "This address doesn't match with any pending candidate");

        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});

        //Check data saved correctly
        const candidateData = await this.DonatoInstance.getCandidateData(receiver, {from: donatoContractOwner});
        expect(candidateData.name).to.equal("Il Buono");
        expect(candidateData.category).to.equal("SME");
        expect(candidateData.description).to.equal("Rebuild ristorante");
        expect(candidateData.country).to.equal("IT");
        expect(candidateData.VAT).to.equal("00547700489");
    });

    //Test 8
    it("Check evaluateCandidate() function", async function() {
        //Check revert if wrong address
        await expectRevert(this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner}), "This address doesn't match with any pending candidate");

        //Case evaluation is accepted
            await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});

            const pendingAddressesArray = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
            expect(pendingAddressesArray[0]).to.equal(receiver);

            //Accept candidate application
            await this.DonatoInstance.evaluateCandidate(receiver, true, {from: donatoContractOwner});

            //Check process flows
            const activeAddressesArray = await this.DonatoInstance.getActiveAddresses({from: donatoContractOwner});
            expect(activeAddressesArray[0]).to.equal(receiver);

            const receiverContractAddress = await this.DonatoInstance.receiversContractAddresses.call(receiver);
            expect(receiverContractAddress).not.to.equal("");

            const pendingAddressesArrayAfter = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
            expect(pendingAddressesArrayAfter[0]).to.equal('0x0000000000000000000000000000000000000000');

        //Case evaluation is rejected
            await this.DonatoInstance.sendApplication("Croix Rouge", "NGO", "We help people", "France", "15989300547700489", {from: accounts[5]});

            const pendingAddressesArrayReject = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
            expect(pendingAddressesArrayReject[1]).to.equal(accounts[5]);

            //Reject candidate application
            await this.DonatoInstance.evaluateCandidate(accounts[5], false, {from: donatoContractOwner});

            //Check process flows
            const pendingAddressesArrayRejectAfter = await this.DonatoInstance.getPendingAddresses({from: donatoContractOwner});
            expect(pendingAddressesArrayRejectAfter[1]).to.equal('0x0000000000000000000000000000000000000000');

            const activeAddressesArrayRejectAfter = await this.DonatoInstance.getActiveAddresses({from: donatoContractOwner});
            expect(activeAddressesArrayRejectAfter.length).to.equal(1);
    });


    //Test 9
    it("Check sending DAI to receiver function", async function() {
        await this.DonatoInstance.sendApplication("Il Buono", "SME", "Rebuild ristorante", "IT", "00547700489", {from: receiver});

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


    //Test 10
    it("Check withdrawCall() function", async function() {
        //Create receiver
        this.DonatoReceiverInstance = await DonatoReceiver.new(receiver, "La Campagnola", "SME", "Rebuild ristorante", "IT", "00547700489", this.TokenERC20DaiInstance.address, {from: donatoContractOwner});
        //Save receiver address
        const newReceiverContractAddress = await this.DonatoReceiverInstance.address;

        //Check revert if balance is empty
        await expectRevert(this.DonatoReceiverInstance.withdrawCall("To repair the entrance", {from: receiver}),"Receiver's balance is empty");
        
        //Transfer DAI to receiver
        let fundAmount = new BN('50')
        await this.TokenERC20DaiInstance.transfer(newReceiverContractAddress, fundAmount, {from: donator1});

        //Save receiver and donatoContractOwner DAI balance
        let beforeWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);
        console.log("Receiver initial balance: ", parseInt(beforeWithdrawReceiverBalance), "DAI");
        let beforeWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
        console.log("Doanto owner initial balance: ", parseInt(beforeWithdrawDonatoBalance), "DAI");

        //Check owner only can call withdraw function
        await expectRevert(this.DonatoReceiverInstance.withdrawCall("To repair the entrance", {from: hacker}),"Caller is not the owner");

        //Withdraw
        await this.DonatoReceiverInstance.withdrawCall("To repair the entrance", {from: receiver});

        //Save DAI balance
        let afterWithdrawReceiverBalance = await this.TokenERC20DaiInstance.balanceOf(newReceiverContractAddress);
        console.log("Receiver after balance: ", parseInt(afterWithdrawReceiverBalance), "DAI");
        let afterWithdrawDonatoBalance = await this.TokenERC20DaiInstance.balanceOf(donatoContractOwner);
        console.log("Donato owner after balance: ", parseInt(afterWithdrawDonatoBalance), "DAI");

        //Compare balances
        expect(afterWithdrawReceiverBalance).to.be.bignumber.equal(beforeWithdrawReceiverBalance.sub(fundAmount));
        expect(afterWithdrawDonatoBalance).to.be.bignumber.equal(beforeWithdrawDonatoBalance.add(fundAmount));
    });


    //Test 11
    it("Check ERC20 stealing impossibility", async function() {
        //Create receiver
        this.DonatoReceiverInstance = await DonatoReceiver.new(receiver, "La Campagnola", "SME", "Rebuild ristorante", "IT", "00547700489", this.TokenERC20DaiInstance.address, {from: donatoContractOwner});
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

        //Check simple ERC20 transfer is impossible from receiver side
        await expectRevert(this.TokenERC20DaiInstance.transfer(hacker, fundAmount, {from: receiver}), "ERC20: transfer amount exceeds balance.");

        //Check transferFrom denial even after approve call
        await this.TokenERC20DaiInstance.approve(hacker, fundAmount, {from: receiver});
        await expectRevert(this.TokenERC20DaiInstance.transferFrom(receiver, hacker, fundAmount, {from: hacker}), "ERC20: transfer amount exceeds balance.");
    });
});