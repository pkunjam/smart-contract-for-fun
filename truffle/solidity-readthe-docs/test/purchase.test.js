const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const bignumber = require('bignumber.js');
const Purchase = artifacts.require('Purchase');

contract('Purchase test suite', function(accounts) {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;
  const SELLER = accounts[1];
  const VALUE = '0x1234567890123456789';
  const BUYER = accounts[2];

  let purchaseContractInstance, txObject;

  before(async function() {
    purchaseContractInstance = await Purchase.new(VALUE, {
      from: SELLER,
      gas: GASLIMIT
    });
  });

  context('Seller aborts sale', function() {
    context('Check constructor invocation is successful', function() {
      let result;
      it('should check seller is set as expected', async function() {
        result = await purchaseContractInstance.seller.call();
        assert.equal(result, SELLER, 'Seller do not match.');
      });
      it('should check value is set as expected', async function() {
        result = new bignumber(await purchaseContractInstance.value.call());
        assert.equal(result.toNumber(), VALUE, 'Value do not match.');
      });
      it('should check owner of value to be seller', async function() {
        result = await purchaseContractInstance.ownerOfValue.call(VALUE);
        assert.equal(result, SELLER, 'Owner do not match.');
      });
      it('should check Purchase state to be Created', async function() {
        result = await purchaseContractInstance.state.call();
        assert.equal(result.toNumber(), 0, 'State do not match.');
      });
    });

    context('abort', function() {
      it('seller calls abort', async function() {
        txObject = await purchaseContractInstance.abort(
          'Aborting due to test reasons',
          { from: SELLER, gas: GASLIMIT }
        );
        assert.equal(txObject.receipt.status, true, 'Abort failed.');
      });
      it('should check Purchase state to be Closed after abort', async function() {
        result = await purchaseContractInstance.state.call();
        assert.equal(result.toNumber(), 3, 'State do not match.');
      });
    });
  });

  describe('Seller sales the value to buyer', function() {
    before(async function() {
      purchaseContractInstance = await Purchase.new(VALUE, {
        from: SELLER,
        gas: GASLIMIT
      });
    });

    context('Buyer confirms the purchase', function() {
      it('confirmPurchase', async function() {
        txObject = await purchaseContractInstance.confirmPurchase({
          from: BUYER,
          gas: GASLIMIT,
          value: 2.1 * 10 ** 18
        });
        assert.equal(txObject.receipt.status, true, 'Confirm purchase failed.');
      });
      it('should check buyer is set as expected', async function() {
        result = await purchaseContractInstance.buyer.call();
        assert.equal(result, BUYER, 'Seller do not match.');
      });
      it('should check Purchase state to be Locked', async function() {
        result = await purchaseContractInstance.state.call();
        assert.equal(result.toNumber(), 1, 'State do not match.');
      });
    });

    context('Buyer confirms the item received', function() {
      let result;
      it('should confirm reception of value', async function() {
        txObject = await purchaseContractInstance.confirmReceived({
          from: BUYER,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Confirm receive failed.');
      });
      it('should check Purchase state to be Sold', async function() {
        result = await purchaseContractInstance.state.call();
        assert.equal(result.toNumber(), 2, 'State do not match.');
      });
      it('should check pendingReturns of SELLER to be 2.1 ether', async function() {
        const value = 2.1 * 10 ** 18;
        result = new bignumber(
          await purchaseContractInstance.pendingReturns.call(SELLER)
        );
        assert.equal(result.toNumber(), value, 'Pending returns do not match.');
      });
      it('should check owner of value to be BUYER', async function() {
        result = await purchaseContractInstance.ownerOfValue.call(VALUE);
        assert.equal(result, BUYER, 'Owner of value do not match.');
      });
    });

    context('withdraw', function() {
      it('SELLER withdraws it"s pending returns', async function() {
        txObject = await purchaseContractInstance.withdraw({
          from: SELLER,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Withdraw failed.');
      });
      it('should check pendingReturns of SELLER to be 0 ether', async function() {
        result = new bignumber(
          await purchaseContractInstance.pendingReturns.call(SELLER)
        );
        assert.equal(result.toNumber(), 0, 'Pending returns do not match.');
      });
    });
  });
});
