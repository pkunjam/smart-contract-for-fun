pragma solidity >=0.4.22 <0.7.0;

/// @title Purchase Contract
/// @author Balaji Shetty Pachai
/// @notice A safe remote purchase smart contract
/// @notice Withdrawal pattern has been used instead of direct trasfer
contract Purchase {
    // Consider value to be an ERC721 Token representing a Television
    uint256 public value;
    address payable public seller;
    address payable public buyer;

    mapping(uint256 => address) public ownerOfValue;
    mapping(address => uint256) public pendingReturns;

    enum State { Created, Locked, Inactive }
    State public state;

    // Consider _value to be a valid ERC721 token ID
    constructor(uint256 _value) public {
        require(msg.sender != address(0), "in Purchase:constructor(). Caller cannot be address zero.");
        seller = msg.sender;
        value = _value;
        ownerOfValue[value] = msg.sender;
        
    }

    modifier condition() {
        require(msg.value > 2 ether, "in Purchase:condition(). Condition is false.");
        _;
    }

    modifier onlyBuyer() {
        require(msg.sender == buyer, "in Purchase:onlyBuyer(). Only buyer can call this.");
        _;
    }

    modifier onlySeller() {
        require(msg.sender == seller, "in Purchase:onlyBuyer(). Only seller can call this.");
        _;
    }

    modifier inState(State _state) {
        require(state == _state, "in Purchase:inState(). Invalid state.");
        _;
    }

    event Aborted(address indexed abortedBy, string indexed reason, uint256 indexed timestamp);
    event PurchaseConfirmed(address indexed confirmedBy, uint256 indexed timestamp);
    event ItemReceived(address indexed receivedBy, uint256 indexed timestamp);

    /// Abort the purchase and reclaim the ether.
    /// Can only be called by the seller before
    /// the contract is locked.
    /// Added a reason string to better know why the sell is being aborted
    function abort(string memory reason) public onlySeller inState(State.Created) {
        emit Aborted(msg.sender, reason, now);
        state = State.Inactive;
        msg.sender.transfer(address(this).balance);
    }

    /// Confirm the purchase as buyer.
    /// Transaction has to include `2 * value` ether.
    /// The ether will be locked until confirmReceived
    /// is called.
    function confirmPurchase() public inState(State.Created) condition payable {
        require(msg.sender != address(0), "in Purchase:confirmPurchase(). Caller cannot be address zero.");
        emit PurchaseConfirmed(msg.sender, now);
        buyer = msg.sender;
        state = State.Locked;
    }

    /// Confirm that you (the buyer) received the item.
    /// This will release the locked ether.
    function confirmReceived() public onlyBuyer inState(State.Locked) {
        emit ItemReceived(msg.sender, now);
        // It is important to change the state first because
        // otherwise, the contracts called using `send` below
        // can call in again here.
        state = State.Inactive;
        pendingReturns[seller] += address(this).balance;
        ownerOfValue[value] = msg.sender;
    }

    function withdraw() public inState(State.Locked) {
        require(msg.sender != address(0), "in Purchase:withdraw(). Caller cannot be address zero.");
        uint256 amountToTransfer = pendingReturns[msg.sender];
        msg.sender.transfer(amountToTransfer);
    }


}