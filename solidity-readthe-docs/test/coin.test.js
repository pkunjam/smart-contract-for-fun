const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const Coin = artifacts.require('Coin');

contract('Coin test suite', function(accounts) {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;
  const ACC1 = accounts[1],
    ACC2 = accounts[2],
    ACC3 = accounts[3];
  let coinContractInstance, txObject;

  before(async function() {
    coinContractInstance = await Coin.new({
      from: COINBASE,
      gas: GASLIMIT
    });
  });

  describe('mint', async function() {
    let coinsToBeMinted = 1000;
    context('mint 1000 coins each for acc1, acc2 & acc3', function() {
      it('should mint 1000 coins for account1', async function() {
        // Since COINBASE is the minter for Coin, thus mint will be invoked by COINBASE
        txObject = await coinContractInstance.mint(ACC1, coinsToBeMinted, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Mint failed');
      });

      it('should mint 1000 coins for account2', async function() {
        // Since COINBASE is the minter for Coin, thus mint will be invoked by COINBASE
        txObject = await coinContractInstance.mint(ACC2, coinsToBeMinted, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Mint failed');
      });

      it('should mint 1000 coins for account3', async function() {
        // Since COINBASE is the minter for Coin, thus mint will be invoked by COINBASE
        txObject = await coinContractInstance.mint(ACC3, coinsToBeMinted, {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Mint failed');
      });
    });

    context('checks minting for acc1, acc2 & acc3 was successfull', function() {
      let balance;
      it('account1"s balance should be 1000', async function() {
        // Since mapping (address => uint) public balances; visibility is public, thus we can access it as specified below
        balance = await coinContractInstance.balances.call(ACC1);
        assert.equal(balance.toNumber(), 1000, 'Balances do not match');
      });

      it('account2"s balance should be 1000', async function() {
        balance = await coinContractInstance.balances.call(ACC2);
        assert.equal(balance.toNumber(), 1000, 'Balances do not match');
      });

      it('account3"s balance should be 1000', async function() {
        balance = await coinContractInstance.balances.call(ACC3);
        assert.equal(balance.toNumber(), 1000, 'Balances do not match');
      });
    });
  });

  describe('send', function() {
    let coinstToSend = 300,
      initialBalance = 1000,
      balance;
    context('transfer 300 coins from acc1 to acc2', function() {
      it('send 300 coins', async function() {
        txObject = await coinContractInstance.send(ACC2, coinstToSend, {
          from: ACC1,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Transfer failed.');
      });
    });

    context('check balances after transfer', function() {
      it('should check account1"s balance to be 700', async function() {
        balance = await coinContractInstance.balances.call(ACC1);
        assert.equal(
          balance.toNumber(),
          initialBalance - coinstToSend,
          'Balances do not match'
        );
      });

      it('should check account2"s balance to be 1300', async function() {
        balance = await coinContractInstance.balances.call(ACC2);
        assert.equal(
          balance.toNumber(),
          initialBalance + coinstToSend,
          'Balances do not match'
        );
      });
    });
  });
});
