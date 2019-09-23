pragma solidity >=0.4.22 <0.7.0;

/// @title Voting with delegation.
/// @author Balaji Shetty Pachai
/// @notice This contract has been developed by referring the below link
/// @dev Ballot contract for e-voting
/// Reference: https://solidity.readthedocs.io/en/v0.5.11/solidity-by-example.html#voting
contract Ballot {
    struct Voter {
        uint256 weight;
        bool voted;
        address delegate;
        uint256 vote;
    }

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    address public chairPerson;

    mapping(address => Voter) public voters;

    // An array of Proposal Struct
    Proposal[] public proposals;

    modifier onlyChairPerson() {
        require(msg.sender == chairPerson, "in Ballot:onlyChairPerson(). Caller is not chairperson");
        _;
    }

    /// @notice constructor function
    /// @param proposalNames Array containig all the proposal names 
    constructor (bytes32[] memory proposalNames) public {
        chairPerson = msg.sender;
        voters[chairPerson].weight = 1;
        // Foe each of the provided proposal names create a new proposal object & add
        // it at the end of the array
        for (uint256 index = 0; index < proposalNames.length; index++) {
            proposals.push(Proposal({name: proposalNames[index], voteCount: 0}));
        }
    }

    /// @notice Give voter the right to vote
    /// @param voter Address of the voter
    function giveRightToVote(address voter) public onlyChairPerson {
        require(!voters[voter].voted, "in Ballot:giveRightToVote(). The voter already voted.");
        require(voters[voter].weight == 0, "in Ballot:giveRightToVote(). Right to vote already granted.");
        voters[voter].weight = 1;
    }

    /// @notice Delegate your vote to the voter `to`
    /// @param to Address to whom the vote will be delegated
    function delegate(address to) public {
        Voter storage sender = voters[msg.sender];
        require(!sender.voted, "in Ballot:delegate(). Caller has already voted.");
        require(to != msg.sender, "in Ballot:delegate(). Self-delegation is disallowed.");
        while (voters[to].delegate != address(0)) {
            to = voters[to].delegate;
            require(to != msg.sender, "in Ballot:delegate(). Found a loop in delegation.");
        }
        sender.voted = true;
        sender.delegate = to;
        Voter storage delegate_ = voters[to];
        if (delegate_.voted) {
            proposals[delegate_.vote].voteCount += sender.weight;
        } else {
            delegate_.weight += sender.weight;
        }
    }

    /// @notice Give your vote (including votes delegated to you)
    /// @param proposal proposals[proposal].name
    function vote(uint256 proposal) public {
        Voter storage sender = voters[msg.sender];
        require(sender.weight != 0, "in Ballot:vote(). Has no right to vote.");
        require(!sender.voted, "in Ballot:vote(). Already voted.");
        sender.voted = true;
        sender.vote = proposal;

        proposals[proposal].voteCount += sender.weight;
    }

    /// @notice Computes the winning proposal
    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    /// @notice Calls winningProposal() to get the index of winner contained
    /// in the proposals array
    function winnerName() public view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    /// @notice Gets the vote weight
    /// This is not recommended, but for the sake of learning
    /// and understanding I have added this functionality
    function getVoterDetails(address voter) public view returns (uint256, bool, address, uint256) {
        return (voters[voter].weight, voters[voter].voted, voters[voter].delegate, voters[voter].vote);
    }
}