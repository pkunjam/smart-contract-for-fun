const chai = require('chai');
const waffle = require('ethereum-waffle');
const SimpleStorage = require('../build/SimpleStorage');

chai.use(waffle.solidity);
const { expect } = chai;

describe('SimpleStorage test suite', async () => {
  const provider = waffle.createMockProvider();
  const [wallet] = waffle.getWallets(provider);
  let simpleStorageContractInstance;

  before(async () => {
    simpleStorageContractInstance = await waffle.deployContract(
      wallet,
      SimpleStorage,
      [1000]
    );
  });

  describe('Check constructor executed successfully', () => {
    it('should check data = 1000', async () => {
      expect(await simpleStorageContractInstance.data.call()).to.eq(1000);
    });
  });

  describe('updateData', () => {
    context('reverts when value is 0', () => {
      it('should revert', async () => {
        await expect(simpleStorageContractInstance.updateData(0)).to.be
          .reverted;
      });
    });

    context('Updates data successfully', () => {
      it('updates data from 1000 to 2000', async () => {
        await expect(simpleStorageContractInstance.updateData(2000))
          .to.emit(simpleStorageContractInstance, 'UpdateData')
          .withArgs(1000, 2000, Math.floor(Date.now() / 10 ** 3));
      });

      it('check data = 2000', async () => {
        expect(await simpleStorageContractInstance.data.call()).to.be.eq(2000);
      });
    });
  });
});
