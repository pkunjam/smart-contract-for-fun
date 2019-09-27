const Purchase = artifacts.require('Purchase');

module.exports = function(deployer, network, accounts) {
  const GASLIMIT = 8000000;
  const SELLER = accounts[1];
  const VALUE = '0x1234567890123456789';

  deployer.deploy(Purchase, VALUE, { from: SELLER, gas: GASLIMIT });
};
