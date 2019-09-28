const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const testHelper = require('../utils/testHelper');
const bignumber = require('bignumber.js');
const BlindAuction = artifacts.require('BlindAuction');

contract('BlindAuction test suite', function(accounts){
    const COINBASE = accounts[0];
    const GASLIMIT = 8000000;
    const BENEFICIARY = accounts[1];
    let now

    const BIDDING_TIME = 300; // Auction ends after 5 minutes
    const REVEAL_TIME = 120; // Reveal time after 7 minutes

    const BIDDER1 = accounts[2];
    const BIDDER2 = accounts[3];
    const BIDDER3 = accounts[4];
    const BIDDER4 = accounts[5];
    const BIDDER5 = accounts[6];


    let blindAuctionContractInstance, txObject;

    before(async function(){
        now = await testHelper.getLatestBlockTimestamp()
        blindAuctionContractInstance = await BlindAuction.new(BIDDING_TIME, REVEAL_TIME, BENEFICIARY, {
            from: COINBASE,
            gas: GASLIMIT
        });
    });

    describe('Checks constructor invocation was successful', function(){
        it('should get beneficiary to be account1', async function(){
            let beneficiary = await blindAuctionContractInstance.beneficiary.call();
            assert.equal(beneficiary, BENEFICIARY, 'Beneficiaries do not match.');
        })

        it('should get biddingEnd to be now + biddingTime', async function(){
            let biddingTime = await blindAuctionContractInstance.biddingEnd.call();
            assert.equal(biddingTime.toNumber(), (now + BIDDING_TIME), 'Bidding end time do not match.');
        })

        it('should get revealEnd to be biddingEnd + REVEAL_TIME', async function(){
            let revealEnd = await blindAuctionContractInstance.revealEnd.call();
            assert.equal(revealEnd.toNumber(), (now + BIDDING_TIME + REVEAL_TIME), 'Reveal time do not match.');
        })
    })

    describe('bid', function(){
        let bidder1BlindedBid, bidder2BlindedBid, bidder3BlindedBid, bidder4BlindedBid, bidder5BlindedBid;
        
        const oneEther = new bignumber(1 * 10 ** 18);
        const twoEther = new bignumber(2 * 10 ** 18);
        const threeEther = new bignumber(3 * 10 ** 18);
        const fourEther = new bignumber(4 * 10 ** 18);
        const fiveEther = new bignumber(5 * 10 ** 18);

        context('BIDDER1...BIDDER5 makes 1..5 ether blinded bids', function(){
            before(function (){
                bidder1BlindedBid = testHelper.getKeccak256Hash(oneEther, false, 'Bidder1"s bid is 1 ether');
                bidder2BlindedBid = testHelper.getKeccak256Hash(twoEther, false, 'Bidder2"s bid is 2 ether');
                bidder3BlindedBid = testHelper.getKeccak256Hash(threeEther, false, 'Bidder3"s bid is 3 ether');
                bidder4BlindedBid = testHelper.getKeccak256Hash(fourEther, false, 'Bidder4"s bid is 4 ether');
                bidder5BlindedBid = testHelper.getKeccak256Hash(fiveEther, false, 'Bidder5"s bid is 5 ether');
            })

            it('BIDDER1 bids 1 ether', async function(){
                txObject = await blindAuctionContractInstance.bid(bidder1BlindedBid, {from: BIDDER1, value: oneEther, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Bid failed.');
            })

            it('BIDDER2 bids 2 ether', async function(){
                txObject = await blindAuctionContractInstance.bid(bidder2BlindedBid, {from: BIDDER2, value: twoEther, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Bid failed.');
            })

            it('BIDDER3 bids 3 ether', async function(){
                txObject = await blindAuctionContractInstance.bid(bidder3BlindedBid, {from: BIDDER3, value: threeEther, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Bid failed.');
            })

            it('BIDDER4 bids 4 ether', async function(){
                txObject = await blindAuctionContractInstance.bid(bidder4BlindedBid, {from: BIDDER4, value: fourEther, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Bid failed.');
            })

            it('BIDDER5 bids 5 ether', async function(){
                txObject = await blindAuctionContractInstance.bid(bidder5BlindedBid, {from: BIDDER5, value: fiveEther, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Bid failed.');
            })

             context('Checks BIDDER1...BIDDER5 bidding was successful', function(){
                 let bidDetail, deposit
                 context('BIDDER1', function(){
                     it('should check BIDDER1"s blindedBid was successful', async function(){
                     bidDetail = await blindAuctionContractInstance.bids.call(BIDDER1, 0);
                     assert.equal(bidDetail.blindedBid, bidder1BlindedBid, 'Blinded bids do not match.');
                    })

                    it('should check BIDDER1"s deposit was 1 ether', async function(){
                        deposit = new bignumber(bidDetail.deposit);
                        assert.equal(deposit.toNumber(), oneEther, 'Deposits do not match.');
                    })
                })

                context('BIDDER2', function(){
                     it('should check BIDDER2"s blindedBid was successful', async function(){
                     bidDetail = await blindAuctionContractInstance.bids.call(BIDDER2, 0);
                     assert.equal(bidDetail.blindedBid, bidder2BlindedBid, 'Blinded bids do not match.');
                    })

                    it('should check BIDDER2"s deposit was 2 ether', async function(){
                        deposit = new bignumber(bidDetail.deposit);
                        assert.equal(deposit.toNumber(), twoEther, 'Deposits do not match.');
                    })
                })

                 context('BIDDER3', function(){
                     it('should check BIDDER3"s blindedBid was successful', async function(){
                     bidDetail = await blindAuctionContractInstance.bids.call(BIDDER3, 0);
                     assert.equal(bidDetail.blindedBid, bidder3BlindedBid, 'Blinded bids do not match.');
                    })

                    it('should check BIDDER3"s deposit was 3 ether', async function(){
                        deposit = new bignumber(bidDetail.deposit);
                        assert.equal(deposit.toNumber(), threeEther, 'Deposits do not match.');
                    })
                })

                 context('BIDDER4', function(){
                     it('should check BIDDER4"s blindedBid was successful', async function(){
                     bidDetail = await blindAuctionContractInstance.bids.call(BIDDER4, 0);
                     assert.equal(bidDetail.blindedBid, bidder4BlindedBid, 'Blinded bids do not match.');
                    })

                    it('should check BIDDER4"s deposit was 4 ether', async function(){
                        deposit = new bignumber(bidDetail.deposit);
                        assert.equal(deposit.toNumber(), fourEther, 'Deposits do not match.');
                    })
                })

                 context('BIDDER5', function(){
                     it('should check BIDDER5"s blindedBid was successful', async function(){
                     bidDetail = await blindAuctionContractInstance.bids.call(BIDDER5, 0);
                     assert.equal(bidDetail.blindedBid, bidder5BlindedBid, 'Blinded bids do not match.');
                    })

                    it('should check BIDDER2"s deposit was 5 ether', async function(){
                        deposit = new bignumber(bidDetail.deposit);
                        assert.equal(deposit.toNumber(), fiveEther, 'Deposits do not match.');
                    })
                })
            })
        })

       
    })

    describe('reveal', function(){

        const oneEther = new bignumber(1 * 10 ** 18);
        const twoEther = new bignumber(2 * 10 ** 18);
        const threeEther = new bignumber(3 * 10 ** 18);
        const fourEther = new bignumber(4 * 10 ** 18);
        const fiveEther = new bignumber(5 * 10 ** 18);

        const values = [oneEther, twoEther, threeEther, fourEther, fiveEther];
        const fake = [false, false, false, false, false];
        const secret = [
            testHelper.getKeccak256Hash('Bidder1"s bid is 1 ether'),
            testHelper.getKeccak256Hash('Bidder2"s bid is 2 ether'),
            testHelper.getKeccak256Hash('Bidder3"s bid is 3 ether'),
            testHelper.getKeccak256Hash('Bidder4"s bid is 4 ether'),
            testHelper.getKeccak256Hash('Bidder5"s bid is 5 ether')
        ];

        before(async function(){
            // end the bidding
            // fast-forward ganache by 6 minutes
            await testHelper.fastForwardGanache(360);
        })

        context('BIDDER1... BIDDER5 reveals their"s blinded bids', function () {
            it('reveal BIDDER1"s blinded bid', async function(){
                txObject = await blindAuctionContractInstance.reveal([values[0]], [fake[0]], [secret[0]], {from: BIDDER1, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Reveal bid failed.');
            })
            it('reveal BIDDER2"s blinded bid', async function(){
                txObject = await blindAuctionContractInstance.reveal([values[1]], [fake[1]], [secret[1]], {from: BIDDER2, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Reveal bid failed.');
            })
            it('reveal BIDDER3"s blinded bid', async function(){
                txObject = await blindAuctionContractInstance.reveal([values[2]], [fake[2]], [secret[2]], {from: BIDDER3, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Reveal bid failed.');
            })
            it('reveal BIDDER4"s blinded bid', async function(){
                txObject = await blindAuctionContractInstance.reveal([values[3]], [fake[3]], [secret[3]], {from: BIDDER4, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Reveal bid failed.');
            })
            it('reveal BIDDER5"s blinded bid', async function(){
                txObject = await blindAuctionContractInstance.reveal([values[4]], [fake[4]], [secret[4]], {from: BIDDER5, gas: GASLIMIT})
                assert.equal(txObject.receipt.status, true, 'Reveal bid failed.');
            })
        })
    })

    describe('withdraw', function() {
        it('Refer simpleAuction.test.js, it is similar to that', function(){
            assert.ok('Add withdraw test cases from simpleAuction.test.js')
        })
    })

    describe('auctionEnd', function() {
        it('Refer simpleAuction.test.js, it is similar to that', function(){
            assert.ok('Add auctionEnd test cases from simpleAuction.test.js')
        })
    })


})