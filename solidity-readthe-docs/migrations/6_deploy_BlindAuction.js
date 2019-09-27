const BlindAuction = artifacts.require('BlindAuction')

module.exports = function(deployer, network, accounts) {
    const COINBASE = accounts[0];
    const BENEFICIARY = accounts[1];
    const SECONDS_IN_DAY = 86400;
    const NO_OF_DAYS = 30;

    const BIDDING_TIME = SECONDS_IN_DAY * NO_OF_DAYS;
    const REVEAL_TIME = SECONDS_IN_DAY * (NO_OF_DAYS + 1);

    deployer.deploy(BlindAuction, BIDDING_TIME, REVEAL_TIME, BENEFICIARY, {from: COINBASE, gas: 8000000})
    
}