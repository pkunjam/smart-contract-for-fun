const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const SimpleStorage = artifacts.require('SimpleStorage');

contract('SimpleStorage Test Suite', function(accounts) {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;
  let simpleStorageContractInstance;

  before(async function() {
    simpleStorageContractInstance = await SimpleStorage.new(100, {
      from: COINBASE,
      gas: GASLIMIT
    });
  });

  describe('updateData', function() {
    let data, txObject;
    it('should check data = 100 as it was set by constructor', async function() {
      // Since it is a read call, therefore .call(), can be executed without .call() also
      data = await simpleStorageContractInstance.getData.call();
      assert.equal(data.toNumber(), 100, 'Values do not match');
    });

    it('should update data to 200', async function() {
      txObject = await simpleStorageContractInstance.updateData(200, {
        from: COINBASE,
        gas: GASLIMIT
      });
      assert.equal(txObject.receipt.status, true, 'Update failed');
    });

    it('should check data = 200 after update', async function() {
      // Since it is a read call, therefore .call(), can be executed without .call() also
      data = await simpleStorageContractInstance.getData.call();
      assert.equal(data.toNumber(), 200, 'Values do not match');
    });
  });

  describe('getData', function() {
    it('should get data"s latest updated value', async function() {
      // Since it is a read call, therefore .call(), can be executed without .call() also
      let data = await simpleStorageContractInstance.getData.call();
      assert.equal(data.toNumber(), 200, 'Values do not match');
    });
  });
});
