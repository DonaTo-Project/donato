const Web3 = require("web3");

const web3 = new Web3(`https://ropsten.infura.io/v3/${process.env.INFURA_KEY}`);

export default function handle(req, res) {
  const { address } = req.params;

  res.writeHead(200, { "content-type": "text/plain" });
  res.end(uuid);
}
