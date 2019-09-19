const Coin = artifacts.require('Coin');

module.exports = function(deployer, network, accounts) {
  console.log('Deploying Coin in ' + network + ' environment');
  const coinbase = accounts[0];
  // coinbase will become the minter for Coin contract
  deployer.deploy(Coin, { from: coinbase, gas: 8000000 });
};
