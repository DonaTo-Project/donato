const Web3 = require("web3");

const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`);

export default async function handle(req, res) {
  const [, address] = req.url.substring(1).split("/");

  console.log(address);

  const balance = Number(
    web3.utils.fromWei(await web3.eth.getBalance(address))
  );

  if (balance > 0) return res.status(200).end();

  let privateKey = `0x${process.env.FUNDING_ACCOUNT_PRIVATE_KEY}`;

  const txParams = {
    to: address,
    gas: "21000",
    value: web3.utils.toWei("0.05"),
  };

  const { rawTransaction } = await web3.eth.accounts.signTransaction(
    txParams,
    privateKey
  );

  await web3.eth.sendSignedTransaction(rawTransaction);

  res.writeHead(200);
  res.end();
}
