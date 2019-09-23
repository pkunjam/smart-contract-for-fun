const BigNumber = web3.BigNumber;
const chai = require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .use(require('chai-as-promised'));
const assert = chai.assert;
const Ballot = artifacts.require('Ballot');

contract('Ballot test suite', function(accounts) {
  const COINBASE = accounts[0];
  const GASLIMIT = 8000000;

  // Details about getting bytes32 proposalNames is specified in migrations/3_deploy_Coin.js
  const proposalNames = [
    '0x42616c616a692053686574747920506163686169000000000000000000000000',
    '0x4176696e61736820426162616e2056617a7261746b6172000000000000000000',
    '0x52757368696b6573682044696e65736820416368617279610000000000000000',
    '0x47617572617620506177616e204167617277616c000000000000000000000000',
    '0x4a696e6f2054686f6d6173000000000000000000000000000000000000000000'
  ];

  const acc1 = accounts[1];
  const acc2 = accounts[2];
  const acc3 = accounts[3];
  const acc4 = accounts[4];
  const acc5 = accounts[5];
  const acc6 = accounts[6];
  const acc7 = accounts[7];
  const acc8 = accounts[8];
  const acc9 = accounts[9];

  let ballotContractInstance, txObject;

  before(async function() {
    ballotContractInstance = await Ballot.new(proposalNames, {
      from: COINBASE,
      gas: GASLIMIT
    });
  });

  describe('giveRightToVote', function() {
    context('grant voting rights to acc1 to acc9', function() {
      it('grants voting right to acc1', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[1], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc2', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[2], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc3', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[3], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc4', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[4], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc5', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[5], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc6', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[6], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc7', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[7], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc8', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[8], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });

      it('grants voting right to acc9', async function() {
        txObject = await ballotContractInstance.giveRightToVote(accounts[9], {
          from: COINBASE,
          gas: GASLIMIT
        });
        assert.equal(
          txObject.receipt.status,
          true,
          'Give Right to vote failed'
        );
      });
    });

    context('check voting rights granted successfully', function() {
      let voterDetails;
      it('gets acc1 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc1);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc2 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc2);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc3 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc3);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc4 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc4);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc5 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc5);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc6 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc6);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc7 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc7);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc8 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc8);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });

      it('gets acc9 voting right', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc9);
        assert.equal(
          voterDetails[0].toNumber(),
          1,
          'Granting voting rights has failed'
        );
      });
    });
  });

  describe('delegate', function() {
    let voterDetails;
    context('vote delgation scenarios', function() {
      it('acc1 delegates vote to acc5', async function() {
        txObject = await ballotContractInstance.delegate(acc5, {
          from: acc1,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote delgation failed');
      });

      it('should check delegation is successful', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc1);
        assert.equal(voterDetails[1], true, 'Vote delegation failed');
      });

      it('acc2 delegates voting right to acc1 which in turn delegates it to acc5', async function() {
        txObject = await ballotContractInstance.delegate(acc1, {
          from: acc2,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote delgation failed');
      });

      it('should check transitive vote delegation took place from acc2 => acc1 => acc5', async function() {
        voterDetails = await ballotContractInstance.getVoterDetails(acc5);
        assert.equal(
          voterDetails[0].toNumber(),
          3,
          'Transitive voting delegation failed'
        );
      });

      it('should confirm acc1 and acc2 has voted as they delegated their vote', async function() {
        let acc1VoteStatus, acc2VoteStatus;
        acc1VoteStatus = await ballotContractInstance.getVoterDetails(acc1);
        acc2VoteStatus = await ballotContractInstance.getVoterDetails(acc2);
        assert.equal(
          acc1VoteStatus[1],
          acc2VoteStatus[1],
          'Voting delegation failed'
        );
      });
    });
  });

  describe('vote', function() {
    context('acc3, acc4 votes proposal[0]', function() {
      it('acc3 votes proposal[0]', async function() {
        txObject = await ballotContractInstance.vote(0, {
          from: acc3,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
      it('acc4 votes proposal[0]', async function() {
        txObject = await ballotContractInstance.vote(0, {
          from: acc4,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
    });

    context('acc5, acc6 votes proposal[1]', function() {
      it('acc5 votes proposal[1]', async function() {
        txObject = await ballotContractInstance.vote(1, {
          from: acc5,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
      it('acc6 votes proposal[1]', async function() {
        txObject = await ballotContractInstance.vote(1, {
          from: acc6,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
    });

    context('acc7 votes proposal[2]', function() {
      it('acc7 votes proposal[2]', async function() {
        txObject = await ballotContractInstance.vote(2, {
          from: acc7,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
    });

    context('acc8, acc9 votes proposal[3]', function() {
      it('acc8 votes proposal[3]', async function() {
        txObject = await ballotContractInstance.vote(3, {
          from: acc8,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
      it('acc9 votes proposal[2]', async function() {
        txObject = await ballotContractInstance.vote(3, {
          from: acc9,
          gas: GASLIMIT
        });
        assert.equal(txObject.receipt.status, true, 'Vote failed');
      });
    });
  });

  describe('winninProposal', function() {
    it('get the winningProposal', async function() {
      let winProposal = await ballotContractInstance.winningProposal.call();
      assert.equal(winProposal.toNumber(), 1, 'Get winningProposal failed.');
    });
  });

  describe('winnerName', function() {
    it('get the winnerName', async function() {
      let winner = await ballotContractInstance.winnerName.call();
      assert.equal(winner, proposalNames[1], 'Winner name do not match.');
    });
  });
});
