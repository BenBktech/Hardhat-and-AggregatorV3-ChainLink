// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PriceConverter.sol";

error FundMe__NotOwner();
error FundMe__NotEnoughtFunds();
error FundMe__CallFailed();

/**
 * @title A contract for crowd funding
 * @author Ben BK
 * @notice This contract is to demo a sample funding contract
 * @dev This implements price feeds as our library
 */
contract FundMe {

    using PriceConverter for uint256;
    // "constant" saves gaz
    //s_ to say it's a storage variable
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] public s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    // "immutable" saves gaz
    address public immutable i_owner;

    AggregatorV3Interface public s_priceFeed;

    modifier onlyOwner {
        //require(msg.sender == i_owner, "Not the owner");
        if(msg.sender != i_owner) { revert FundMe__NotOwner(); }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    //What happens if someone sends this contract ETH without calling the fund function
    // receive() to send a transaction
    receive() external payable {
        fund();
    }

    // fallback() to send datas
    fallback() external payable {
        fund();
    }

    /**
     * @notice This function funds this contract
     */
    function fund() public payable {
        //require(msg.value.getConversionRate() >= MINIMUM_USD, "Didnt't send enought"); // 1e18 = 1 ether
        if(msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) { revert FundMe__NotEnoughtFunds(); }
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        for(uint256 funderIndex = 0 ; funderIndex < s_funders.length ; funderIndex++) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        // reset the array
        s_funders = new address[](0);
        // withdraw the funds
        // transfer
        //payable(msg.sender).transfer(address(this).balance);
        // send
        //bool sendSuccess = payable(msg.sender).send(address(this).balance);
        //require(sendSuccess, "Send failed");
        // call
        (bool callSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");
        //require(callSuccess, "Call failed");
        if(!callSuccess) { revert FundMe__CallFailed(); }
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;
        //mappings can't be in memory 
        for(uint256 funderIndex = 0 ; 
            funderIndex < funders.length ; 
            funderIndex++
        ) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }
        s_funders = new address[](0);
        (bool success,) = i_owner.call{value: address(this).balance}("");
        require(success);
    }

}