pragma solidity 0.5.2;

/// @title SimpleStorage
/// @author Balaji Shetty Pachai 
/// @notice A SimpleStorage contract used for setting and fetching values to and from Blockchain
contract SimpleStorage {
    uint256 public data;

    /// @notice Constructor that sets data to the value passed in at the time of contract creation
    constructor (uint256 _value) public {
        require(_value > 0, "in SimpleStorage:constructor(). Value must be greater than 0.");
        data = _value;
    }

    /// @notice This function will update data to the user defined value
    /// @param _value The value that has to be used for updating data
    function updateData(uint256 _value) public {
        require(_value > 0, "in SimpleStorage:setData(). Value must be greater than 0.");
        data = _value;
    }

    /// @notice Function that returns the value of data
    /// @return Data's latest value
    function getData() public view returns (uint256) {
        return data;
    }

}