const Betting = artifacts.require('Betting');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];
  deployer.deploy(Betting, { from: coinbase, gas: 8000000 });
};
