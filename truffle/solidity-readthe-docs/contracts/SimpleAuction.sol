pragma solidity >=0.4.22 <0.7.0;

/// @title SimpleAuction
/// @author Balaji Shetty Pachai
/// @notice Everyone can send their bids during a bidding period.
/// Ref: https://solidity.readthedocs.io/en/v0.5.11/solidity-by-example.html#simple-open-auction
contract SimpleAuction {
    address payable public beneficiary;
    uint256 public auctionEndTime;

    // Current state of the auction
    address public highestBidder;
    uint256 public highestBid;

    // Allowed withdrawals of pervious bids
    mapping(address => uint256) public pendingReturns;

    // Set to true at the end, disallows any change.
    // By default initialized to `false`.
    bool public ended; // It is not recommended

    // Events that will be emitted on changes.
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    /// Create a simple auction with `_biddingTime`
    /// seconds bidding time on behalf of the
    /// beneficiary address `_beneficiary`
    constructor (uint _biddingTime, address payable _beneficiary) public {
        require(_beneficiary != address(0), "in SimpleAuction:constructor(). Beneficiary cannot be zero address.");
        beneficiary = _beneficiary;
        auctionEndTime = now + _biddingTime;
    }

    /// Bid on the auction with the value sent
    /// together with this transaction.
    /// The value will only be refunded if the
    /// auction is not won.
    function bid() public payable {
        require(msg.sender != address(0), "in SimpleAuction:bid(). Caller cannot be zero address.");
        require(msg.value > 0, "in SimpleAuction:bid(). Bid amount must be greater than 0.");
        require(now <= auctionEndTime, "in SimpleAuction:bid(). Auction already ended.");
        require(msg.value > highestBid, "in SimpleAuction:bid(). There already is a higher bid.");
        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    /// Withdraw a bid that was overbid
    function withdraw() public returns (bool) {
        uint256 amount = pendingReturns[msg.sender];
        require(amount > 0, "in SimpleAuction:withdra(). You did not place a bid.");
        pendingReturns[msg.sender] = 0;
        if (!msg.sender.send(amount)) {
            pendingReturns[msg.sender] = amount;
            return false;
        }
        return true;
    }

    /// End the auction and send the highest bid to the beneficiary
    function auctionEnd() public {
        /// 1. Conditions
        require(now >= auctionEndTime, "in SimpleAuction:auctionEnd(). Auction not yet ended.");
        require(!ended, "in SimpleAuction:auctionEnd(). Auction has already ended.");
        /// 2. Effects
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        /// 3. Interaction
        beneficiary.transfer(highestBid);
    }
}