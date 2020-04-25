const Web3 = require("web3");

const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`);

export default async function handle(req, res) {
  const { address } = req.params;

  let privateKey = `0x${process.env.FUNDING_ACCOUNT_PRIVATE_KEY}`;

  const txParams = {
    to: address,
    value: web3.utils.toWei("0.05"),
  };

  const { rawTransaction } = await web3.eth.accounts.signTransaction(
    txParams,
    privateKey
  );

  await web3.eth.sendSignedTransaction(rawTransaction);

  res.writeHead(200, { "content-type": "text/plain" });
  res.end();
}
