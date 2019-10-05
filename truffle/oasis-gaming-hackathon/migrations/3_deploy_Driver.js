const Driver = artifacts.require('Driver');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];
  const TOKEN_NAME = 'DRIVERTOKEN'
  const SYMBOL = 'DRIT'
  deployer.deploy(Driver, TOKEN_NAME, SYMBOL, { from: coinbase, gas: 8000000 });
};
