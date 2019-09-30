const TicTacToe = artifacts.require('TicTacToe');

module.exports = function(deployer, network, accounts) {
  const PLAYER1 = accounts[0];
  deployer.deploy(TicTacToe, {
    from: PLAYER1,
    value: 1 * 10 ** 18,
    gas: 8000000
  });
};
