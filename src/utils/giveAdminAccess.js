const Web3 = require("web3");
const Contract = require("@truffle/contract");

const web3 = new Web3(process.env.CHAIN_API_URL);

const DonatoContract = require("../../build/contracts/Donato.json");

let privateKey = process.env.FUNDING_ACCOUNT_PRIVATE_KEY;

async function giveAdminRoleTo(account = process.env.ADMIN_ACCOUNT) {
  let owner = web3.eth.accounts.privateKeyToAccount(privateKey);
  let Donato = Contract(DonatoContract);
  Donato.setProvider(web3.currentProvider);
  const DonatoInstance = await Donato.deployed();

  console.log(DonatoInstance.address);

  await DonatoInstance.addAdmin(account, { from: owner.address });
}

giveAdminRoleTo(process.env.ADMIN_ACCOUNT).then(() => {
  process.exit();
});
