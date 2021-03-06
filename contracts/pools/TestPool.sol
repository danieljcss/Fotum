// SPDX-License-Identifier:GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/* This pool gives yield farming rewards on USDC, once you deposit 
 * the tokens are staked automatically once the next epochs starts. 
 * The staked funds can be withdrawn at any time but the rewards are 
 * calculated as a function of the funds that have been staked for 
 * at least one epoch
 */

interface IFotum {
    function updateBalances(address _poolAddress) external;
}

contract TestPool {
    string public name = "USDC TestPool";
    IERC20 public USDC;
    uint256 public intervalReward; // 100% = 10^18, 1% = 10^16,  
    //261157876067812 -> 0.026...% -> 10% in 365 intervals

    /* Timers to fire staking distribution */
    uint public immutable interval;
    uint public lastTimeStamp;

    address[] public stakers;
    mapping(address => bool) public isUser;
    mapping(address => uint256) public depositBalance;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public rewards;
    uint256 public totalStakedAmount;
    uint256 public totalDepositedAmount;

    constructor(
        address _USDCAddress, 
        uint256 _intervalReward, 
        uint256 _updateInterval
    ) {
        USDC = IERC20(_USDCAddress);
        intervalReward = _intervalReward;
        interval = _updateInterval;
        lastTimeStamp = block.timestamp;
    }

    /* Deposits Tokens, needs ERC20 approval from user */
    function depositTokens(uint256 _amount) external {
        require(_amount > 0, "Please stake more than 0 tokens");
        USDC.transferFrom(msg.sender, address(this), _amount);
        uint256 previousBalance = depositBalance[msg.sender];
        depositBalance[msg.sender] = previousBalance + _amount;
        if (isUser[msg.sender] == false ){
             stakers.push(msg.sender);
             isUser[msg.sender] == true;
        } 
        totalDepositedAmount += _amount;
    }

    /* Unstaking Tokens to deposit balance */
    function unstakeTokens(uint256 _amount) external {
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, "You do not have tokens to unstake");
        require(_amount <= balance, "Not enough tokens to unstake");
        stakingBalance[msg.sender] = balance - _amount;
        totalStakedAmount -= _amount;
        USDC.transfer(msg.sender, balance);  
    }

    /* Gets the reward for a given staker */
    function getUserReward(address user) public view returns (uint256) {
        uint256 balance = stakingBalance[user];
        uint reward = balance * intervalReward / 10 ** 18;
        return reward;
        // Only give reward once a full epoch has passed
    }

    /* Distribute Tokens to all stakers */
    function _distributeAndStakeDepositedTokens() internal {
        for (
            uint256 stakersIndex = 0;
            stakersIndex < stakers.length;
            stakersIndex++
        ) {
            /* Calculates rewards for the amount staked at the beginning of the epoch */
            address user = stakers[stakersIndex];
            uint256 userReward = getUserReward(user);

            /* Transfers deposited balance to staked balance after calculating the rewards for this epoch */
            uint256 deposit = depositBalance[user];
            depositBalance[user] = 0;
            totalDepositedAmount -= deposit;
            rewards[user] += userReward;
            stakingBalance[user] += userReward + deposit;
            totalStakedAmount += userReward + deposit;
        }
    }

    /* Checks if the time interval has passed */
    function checkUpkeep(bytes calldata /* checkData */) external view returns (bool upkeepNeeded, bytes memory /* performData */) {
        upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
        // We don't use the checkData in this example. The checkData is defined when the Upkeep was registered.
    }

    function performUpkeep(bytes calldata /* performData */) external {
        //We highly recommend revalidating the upkeep in the performUpkeep function
        if ((block.timestamp - lastTimeStamp) > interval ) {
            lastTimeStamp = block.timestamp;
            _distributeAndStakeDepositedTokens();
        }
        // We don't use the performData in this example. The performData is generated by the Keeper's call to your checkUpkeep function
    }
}