const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const bignumber = require('bignumber.js');
const WithdrawalContract = artifacts.require('WithdrawalContract');

contract('WithdrawalContract Test Suite', function(accounts) {
  const coinbase = accounts[0];
  const acc1 = accounts[1];
  const GAS = 8000000;

  let withdrawalContractInstance;
  before(async function() {
    withdrawalContractInstance = await WithdrawalContract.new({
      from: coinbase,
      value: 1 * 10 ** 18,
      gas: GAS
    });
  });

  describe('Checks constructor invocation', function() {
    it('should check the richest to be coinbase account', async function() {
      let richest = await withdrawalContractInstance.richest.call();
      assert.equal(richest, coinbase, 'Richest do not match.');
    });

    it('should check the mostSent amount to be 1', async function() {
      let mostSent = new bignumber(
        await withdrawalContractInstance.mostSent.call()
      );
      assert.equal(
        mostSent.toNumber(),
        1 * 10 ** 18,
        'Most sent do not match.'
      );
    });
  });

  describe('becomeRichest', () => {
    context('success', () => {
      let txObject, newRichest, newMostSent;
      it('when acc1 sends 2 ether to become the new richest', async function() {
        txObject = await withdrawalContractInstance.becomeRichest({
          from: acc1,
          value: 2 * 10 ** 18,
          gas: GAS
        });
        assert.equal(txObject.receipt.status, true, 'Become richest failed.');
      });

      it('check the new richest to be acc1', async function() {
        newRichest = await withdrawalContractInstance.richest.call();
        assert.equal(newRichest, acc1, 'New richest do not match.');
      });

      it('check mostSent to be 2 ether', async function() {
        newMostSent = new bignumber(
          await withdrawalContractInstance.mostSent.call()
        );
        assert.equal(newMostSent, 2 * 10 ** 18, 'New most sent do not match');
      });
    });
  });

  describe('withdraw', function() {
    let balance;
    context('Check pending withdrawals before withdraw', function() {
      it('acc0 pending withdrawals should be 1 ether', async function() {
        balance = new bignumber(
          await withdrawalContractInstance.pendingWithdrawals.call(coinbase)
        );
        assert.equal(
          balance.toNumber(),
          1 * 10 ** 18,
          'Pending withdrawal do not match.'
        );
      });

      it('acc1 pending withdrawals should be 2 ether', async function() {
        balance = new bignumber(
          await withdrawalContractInstance.pendingWithdrawals.call(acc1)
        );
        assert.equal(
          balance.toNumber(),
          2 * 10 ** 18,
          'Pending withdrawal do not match.'
        );
      });
    });

    context('Execute withdraw for acc0 and acc1', function() {
      it('acc0 executes withdraw', async function() {
        txObject = await withdrawalContractInstance.withdraw({
          from: coinbase,
          gas: GAS
        });
        assert.equal(txObject.receipt.status, true, 'Withdraw failed.');
      });

      it('acc1 executes withdraw', async function() {
        txObject = await withdrawalContractInstance.withdraw({
          from: acc1,
          gas: GAS
        });
        assert.equal(txObject.receipt.status, true, 'Withdraw failed.');
      });
    });

    context('Check pending withdrawals after withdraw', function() {
      it('acc0 pending withdrawals should be 0 ether', async function() {
        balance = new bignumber(
          await withdrawalContractInstance.pendingWithdrawals.call(coinbase)
        );
        assert.equal(balance.toNumber(), 0, 'Pending withdrawal do not match.');
      });

      it('acc1 pending withdrawals should be 0 ether', async function() {
        balance = new bignumber(
          await withdrawalContractInstance.pendingWithdrawals.call(acc1)
        );
        assert.equal(balance.toNumber(), 0, 'Pending withdrawal do not match.');
      });
    });
  });
});
