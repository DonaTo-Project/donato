const TokenERC20Dai = artifacts.require("TokenERC20Dai");
const Donato = artifacts.require("Donato");

module.exports = function(deployer) {
	deployer.then(async () => {
      await deployer.deploy(TokenERC20Dai);
      await deployer.deploy(Donato, TokenERC20Dai.address);
  })
};