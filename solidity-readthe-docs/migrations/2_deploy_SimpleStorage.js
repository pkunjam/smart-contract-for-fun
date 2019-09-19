const SimpleStorage = artifacts.require('SimpleStorage');

module.exports = function(deployer, network, accounts) {
  console.log('Deploying SimpleStorage in ' + network + ' environment');
  const coinbase = accounts[0];
  deployer.deploy(SimpleStorage, 100, { from: coinbase, gas: 8000000 });
};
