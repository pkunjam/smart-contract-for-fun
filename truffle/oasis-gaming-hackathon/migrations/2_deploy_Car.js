const Car = artifacts.require('Car');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];
  const TOKEN_NAME = 'CARTOKEN'
  const SYMBOL = 'CART'
  deployer.deploy(Car, TOKEN_NAME, SYMBOL, { from: coinbase, gas: 8000000 });
};
