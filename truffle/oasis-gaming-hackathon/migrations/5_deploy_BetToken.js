const BetToken = artifacts.require('BetToken');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];
  const NAME = 'TESTBETTOKEN'
  const SYMBOL = 'TBETT'
  const DECIMALS = 18
  const AMOUNT = 10000000000000
  deployer.deploy(BetToken, NAME, SYMBOL, DECIMALS, coinbase, AMOUNT,{ from: coinbase, gas: 8000000 });
};
