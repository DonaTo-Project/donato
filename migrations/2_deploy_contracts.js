const TokenERC20Dai = artifacts.require("TokenERC20Dai");
const Donato = artifacts.require("Donato");

module.exports = function(deployer) {
  deployer.deploy(TokenERC20Dai);
  deployer.deploy(Donato, TokenERC20Dai.address);
  // deployer.link(ConvertLib, MetaCoin);
};
