const WithdrawalContract = artifacts.require('WithdrawalContract');

module.exports = function(deployer, network, accounts) {
  const coinbase = accounts[0];

  deployer.deploy(WithdrawalContract, {
    from: coinbase,
    value: 1 * 10 ** 18,
    gas: 8000000
  });
};
