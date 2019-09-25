pragma solidity >0.4.23 <0.7.0;

/// @title BlindAuction contract
/// @author Balaji Shetty Pachai
/// @notice A blind auction on a transparent computing platform, during the bidding period
/// a bidder does not actually send their bid, but only a hashed version of it.
contract BlindAuction {
    struct Bid {
        bytes32 blindedBid;
        uint256 deposit;
    }

    address payable public beneficiary;
    uint256 public biddingEnd;
    uint256 public revealEnd;
    bool public ended;

    mapping(address => Bid[]) public bids;

    address public highestBidder;
    uint256 public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint256) public pendingReturns;

    event AuctionEnded(address winner, uint256 highestBid);

    modifier onlyBefore(uint256 _time) {
        require(now < _time, "in BlindAuction:onlyBefore(). Current time is greater.");
        _;
    }

    modifier onlyAfter(uint256 _time) {
        require(now > _time, "in BlindAuction:onlyAfter(). Current time is smaller.");
        _;
    }

    /// @notice Constructor function 
    constructor (uint256 _biddingTime, uint256 _revealTIme, address payable _beneficiary) public {
        require(_beneficiary != address(0), "in BlindAuction:constructor(). Beneficiary is address(0).");
        require(_biddingTime > 0, "in BlindAuction:constructor(). Bidding time is 0.");
        
        beneficiary = _beneficiary;
        biddingEnd = now + _biddingTime;
        revealEnd = biddingEnd + _revealTime;

    } 

    /// @notice Place a blinded bid with `_blindedBid` =
    /// keccak256(abi.encodePacked(value, fake, secret)).
    /// The sent ether is only refunded if the bid is correctly
    /// revealed in the revealing phase. The bid is valid if the
    /// ether sent together with the bid is at least "value" and
    /// "fake" is not true. Setting "fake" to true and sending
    /// not the exact amount are ways to hide the real bid but
    /// still make the required deposit. The same address can
    /// place multiple bids.
    function bid(bytes32 _blindedBid) public payable onlyBefore(biddingEnd) {
        bids[msg.sender].push(Bid({
            blindedBid: _blindedBid,
            deposit: msg.value
        }));
    }

    /// @notice Reveal your blinded bids. You will get a refund for all
    /// correctly blinded invalid bids and for all bids except for
    /// the totally highest.
    function reveal(
        uint256[] memory _values,
        bool[] memory _fake,
        bytes32[] memory _secret
    ) 
        public  
        onlyAfter(biddingEnd)
        onlyBefore(revealEnd)
    {
        uint256 length = bids[msg.sender].length;

        require(_values.length == length, "in BlindAuction:reveal(). Values length do not match.");
        require(_fake.length == length, "in BlindAuction:reveal(). Fake length do not match.");
        require(_secret.length == length, "in BlindAuction:reveal(). Secret length do not match.");

        uint256 refund;
        for (uint256 i = 0; i < length; i++) {
            Bid storage bidToCheck = bids[msg.sender][i];
            (uint256 value, bool fake, bytes32 secret) = (_values[i], _fake[i], _secret[i]);
            if (bidToCheck.blindedBid != keccak256(abi.encodePacked(value, fake, secret))) {
                // Bid was not actually revealed
                // Do not refund deposit
                continue;
            }
            refund += bidToCheck.deposit;
            if (!fake && bidToCheck.deposit >= value) {
                if (placeBid(msg.sender, value)) {
                    refund -= value;
                }
            }
            // Make it impossible for the sender to re-claim the same deposit
            bidToCheck.blindedBid = bytes32(0);
        }
    }

    // Withdraw bid that was overbid
    function withdraw() public {
        uint256 amount = pendingReturns[msg.sender];
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
            msg.sender.transfer(amount);
        }
    }

    function auctionEnd() public onlyAfter(revealEnd) {
        require(!ended, "in BlindAuction:auctionEnd(). Auction has already ended.");
        emit AuctionEnded(highestBidder, highestBid);
        ended = true;
        beneficiary.transfer(highestBid);
    }

    // This is an "internal" function which means that it
    // can only be called from the contract itself (or from
    // derived contracts).
    function placeBid(address bidder, uint256 value) internal returns (bool success) {
        if (value <= highestBid) {
            return false;
        }

        if (highestBidder != address(0)) {
            // Refund the previously highest bidder
            pendingReturns[highestBidder] += highestBid;
        }
        highestBid = value;
        highestBidder = bidder;
        return true;
    }

    



}