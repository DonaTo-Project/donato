import Web3 from "web3";

var web3 = new Web3(process.env.CHAIN_API_URL);

function convertERC20BalanceToDecimal(balance) {
  let BN = web3.utils.BN;

  let bnBalanceStr = new BN(balance).toString();
  let bnBalanceInt = bnBalanceStr.substring(0, bnBalanceStr.length - 18);
  let bnBalanceDecimal = bnBalanceStr.substring(bnBalanceStr.length - 18);

  const convertedBalance = parseFloat(`${bnBalanceInt}.${bnBalanceDecimal}`);

  return convertedBalance;
}

export default convertERC20BalanceToDecimal;
