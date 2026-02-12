                        // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./ClinicRewardToken.sol";

contract ClinicLoyaltyFund {
    ClinicRewardToken public immutable rewardToken;
    AggregatorV3Interface internal priceFeed;


    string public constant CAMPAIGN_TITLE = "Clinic Loyalty Fund - Perpetual Rewards";
    uint256 public constant FUNDING_GOAL = type(uint256).max;
    uint256 public totalRaised;

    mapping(address => uint256) public contributions;

    event Contributed(address indexed contributor, uint256 amountETH, uint256 tokensMinted);
    event TokensBurned(address indexed user, uint256 amount);

    constructor(address _rewardTokenAddress) {
    rewardToken = ClinicRewardToken(_rewardTokenAddress);
    priceFeed = AggregatorV3Interface(
        0x694AA1769357215DE4FAC081bf1f309aDC325306
    );
}


function getETHPrice() public view returns (uint256) {
    (, int256 price,,,) = priceFeed.latestRoundData();
    return uint256(price);
}

uint256 public constant CRT_PRICE_USD = 100 * 1e8;


function contribute() external payable {
    require(msg.value > 0, "Zero ETH");

    uint256 ethPrice = getETHPrice();

    uint256 usdValue = msg.value * ethPrice / 1e18;


    uint256 tokensToMint =
        usdValue * 1e18 / CRT_PRICE_USD;

    rewardToken.mint(msg.sender, tokensToMint);

    contributions[msg.sender] += msg.value;
    totalRaised += msg.value;

    emit Contributed(
        msg.sender,
        msg.value,
        tokensToMint
    );
}



    function getMyContribution() external view returns (uint256) {
        return contributions[msg.sender];
    }

    function getTotalRaised() external view returns (uint256) {
        return totalRaised;
    }

        function redeemForService(uint256 tokenAmount, string memory serviceNote) external {
        require(tokenAmount > 0, "Amount must be >0");

        rewardToken.burnFrom(msg.sender, tokenAmount);

        emit TokensBurned(msg.sender, tokenAmount);
    }
}