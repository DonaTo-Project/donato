const Web3 = require("web3");

const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`);

(async () => {
  const wallet = await web3.eth.accounts.wallet.create(1);

  console.log("PRIVKEY");
  console.log(wallet[0].privateKey);
  console.log("ADDRESS");
  console.log(wallet[0].address);
})();
