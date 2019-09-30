const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const bignumber = require('bignumber.js');

const TicTactToe = artifacts.require('TicTacToe');

contract('TicTacToe test suite', function(accounts) {
  const PLAYER1 = accounts[0];
  const PLAYER2 = accounts[1];
  const GASLIMIT = 8000000;
  const oneEther = 1 * 10 ** 18;

  let ticTacToeContractInstance, txObject;
  before(async function() {
    ticTacToeContractInstance = await TicTactToe.new({
      from: PLAYER1,
      value: oneEther,
      gas: GASLIMIT
    });
  });

  describe('Check successful constructor invocation', function() {
    let result;
    it('should check PLAYER1 is set', async function() {
      result = await ticTacToeContractInstance.playerOneAddr.call();
      assert.equal(result, PLAYER1, 'Player one address do not match.');
    });
    it('should check PLAYER1 balance to be 1 ether', async function() {
      result = new bignumber(
        await ticTacToeContractInstance.playerBalance.call(PLAYER1)
      );
      assert.equal(
        result.toNumber(),
        oneEther,
        'Player1 balance do not match.'
      );
    });
  });
});
