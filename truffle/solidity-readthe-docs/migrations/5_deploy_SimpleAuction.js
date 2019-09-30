const SimpleAuction = artifacts.require('SimpleAuction');

module.exports = function(deployer, network, accounts) {
  const COINBASE = accounts[0];
  const BENEFICIARY = accounts[1];
  const SECONDS_IN_DAY = 86400;
  const END_AUCTION_AFTER_DAYS = 31;
  const BID_END_TIME = SECONDS_IN_DAY * END_AUCTION_AFTER_DAYS;

  deployer.deploy(SimpleAuction, BID_END_TIME, BENEFICIARY, {
    from: COINBASE,
    gas: 8000000
  });
};
