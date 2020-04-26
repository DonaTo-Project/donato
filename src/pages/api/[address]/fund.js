const Web3 = require("web3");

const web3 = new Web3(process.env.CHAIN_API_URL);

export default async function handle(req, res) {
  const [, address] = req.url.substring(1).split("/");

  const balance = Number(
    web3.utils.fromWei(await web3.eth.getBalance(address))
  );

  if (balance > 0) return res.status(200).end();

  let privateKey = `0x${process.env.FUNDING_ACCOUNT_PRIVATE_KEY.replace(
    "0x",
    ""
  )}`;

  const txParams = {
    to: address,
    gas: "21000",
    value: web3.utils.toWei("0.1"),
  };

  const { rawTransaction } = await web3.eth.accounts.signTransaction(
    txParams,
    privateKey
  );

  await web3.eth.sendSignedTransaction(rawTransaction);

  res.writeHead(200);
  res.end();
}
