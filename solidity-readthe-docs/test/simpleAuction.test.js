const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const bignumber = require('bignumber.js');
const testHelper = require('../utils/testHelper');
const SimpleAuction = artifacts.require('SimpleAuction');

contract('SimpleAuction test suite', function(accounts) {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;
  const BENEFICIARY = accounts[1];
  const BID_END_TIME = 60; // Auction ends after 1 minute

  const acc2 = accounts[2];
  const acc3 = accounts[3];
  const acc4 = accounts[4];
  const acc5 = accounts[5];

  let simpleAuctionContractInstance, txObject;

  before(async function() {
    simpleAuctionContractInstance = await SimpleAuction.new(
      BID_END_TIME,
      BENEFICIARY,
      {
        from: COINBASE,
        gas: GASLIMIT
      }
    );
  });

  describe('Check constructor invocation was successful', function() {
    it('acc1 must be the beneficiary', async function() {
      let beneficiary = await simpleAuctionContractInstance.beneficiary.call();
      assert.equal(beneficiary, BENEFICIARY, 'Beneficiary do not match');
    });
  });

  describe('bid', function() {
    context('acc2, acc3, acc4 & acc5 bids 1, 2, 3, 4 Ethers', function() {
      it('acc2 bids 1 Ethers', async function() {
        txObject = await simpleAuctionContractInstance.bid({
          from: acc2,
          value: 1 * 10 ** 18,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Bid failed');
      });

      it('acc3 bids 2 Ethers', async function() {
        txObject = await simpleAuctionContractInstance.bid({
          from: acc3,
          value: 2 * 10 ** 18,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Bid failed');
      });

      it('acc4 bids 3 Ethers', async function() {
        txObject = await simpleAuctionContractInstance.bid({
          from: acc4,
          value: 3 * 10 ** 18,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Bid failed');
      });

      it('acc5 bids 4 Ethers', async function() {
        txObject = await simpleAuctionContractInstance.bid({
          from: acc5,
          value: 4 * 10 ** 18,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Bid failed');
      });
    });

    context('Check bidding was successful', function() {
      let balance;
      it('should check pendingReturns of acc2 to be 1 ethers', async function() {
        balance = new bignumber(
          await simpleAuctionContractInstance.pendingReturns.call(acc2)
        );
        assert.equal(
          balance.toNumber(),
          1 * 10 ** 18,
          'Pending returns do not match'
        );
      });

      it('should check pendingReturns of acc2 to be 2 ethers', async function() {
        balance = new bignumber(
          await simpleAuctionContractInstance.pendingReturns.call(acc3)
        );
        assert.equal(
          balance.toNumber(),
          2 * 10 ** 18,
          'Pending returns do not match'
        );
      });

      it('should check pendingReturns of acc2 to be 3 ethers', async function() {
        balance = new bignumber(
          await simpleAuctionContractInstance.pendingReturns.call(acc4)
        );
        assert.equal(
          balance.toNumber(),
          3 * 10 ** 18,
          'Pending returns do not match'
        );
      });

      it('should check the highestBid amount to be 4 ethers', async function() {
        let highestBid = new bignumber(
          await simpleAuctionContractInstance.highestBid.call()
        );
        assert.equal(
          highestBid.toNumber(),
          4 * 10 ** 18,
          'Highest bid amount do not match'
        );
      });

      it('should check the highestBidder to be acc5', async function() {
        let highestBidder = await simpleAuctionContractInstance.highestBidder.call();
        assert.equal(highestBidder, acc5, 'Highest bidder do not match');
      });
    });
  });

  describe('withdraw', function() {
    context('acc2, acc3 & acc3 withdraw their pendingReturns', function() {
      it('acc2 withdraws the pendingReturns', async function() {
        txObject = await simpleAuctionContractInstance.withdraw({
          from: acc2,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Withdrawal failed');
      });

      it('acc3 withdraws the pendingReturns', async function() {
        txObject = await simpleAuctionContractInstance.withdraw({
          from: acc3,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Withdrawal failed');
      });

      it('acc4 withdraws the pendingReturns', async function() {
        txObject = await simpleAuctionContractInstance.withdraw({
          from: acc4,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Withdrawal failed');
      });
    });

    context('checks withdrawal is successful', function() {
      let pendingReturns;
      it('acc2 pendingReturns is 0', async function() {
        pendingReturns = new bignumber(
          await simpleAuctionContractInstance.pendingReturns.call(acc2)
        );
        assert.equal(pendingReturns.toNumber(), 0, 'Withdrawal failed');
      });

      it('acc3 pendingReturns is 0', async function() {
        pendingReturns = pendingReturns = new bignumber(
          await simpleAuctionContractInstance.pendingReturns.call(acc3)
        );
        assert.equal(pendingReturns.toNumber(), 0, 'Withdrawal failed');
      });

      it('acc4 pendingReturns is 0', async function() {
        pendingReturns = pendingReturns = new bignumber(
          await simpleAuctionContractInstance.pendingReturns.call(acc4)
        );
        assert.equal(pendingReturns.toNumber(), 0, 'Withdrawal failed');
      });
    });
  });

  describe('auctionEnd', function() {
    it('fast forward ganache by 2 minutes', async function() {
      await testHelper.fastForwardGanache(120);
    });

    it('transfer the highestBid to the beneficiary', async function() {
      txObject = await simpleAuctionContractInstance.auctionEnd({
        from: COINBASE,
        gas: GASLIMIT
      });
      assert.equal(txObject.receipt.status, true, 'auctionEnd failed');
    });

    it('should check the auction has ended', async function() {
      let isEnded = await simpleAuctionContractInstance.ended.call();
      assert.equal(isEnded, true, 'Auction has not ended yet');
    });
  });
});
