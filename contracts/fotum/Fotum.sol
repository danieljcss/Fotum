// SPDX-License-Identifier:GPL-3.0

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';

interface IFotumToken {
    function mint(address to, uint256 amount) external;
}

interface IFoutumNFT {
    function createToken(address to, uint256 totalRewards) external;
}

interface IPriceFeed {
    function getLatestPrice() external view returns (int);
}

interface IPool {
    function users() external view returns (address[] memory);
    function userToRewards(address key) external view returns (uint256);
    function getAmountStaked(address _user) external view returns (uint256);
}

//error NotEnoughFunds(uint256 amount, uint256 balance);

contract Fotum {
    struct Pool {
        address pool;//Pool Adapter Contract
        uint256 totalStakedAmount;
        uint256 supportedTokenId;
        mapping(address => uint256) userToStakedAmount;
        mapping(address => uint256) userToRewards;
    }
    struct User {
        address user;
        uint256 stakeProportion;
        uint256 stakingFee;
        mapping(uint256 => uint256) balances;
        mapping(uint256 => uint256) stakedBalances;
        Child[] children;
        CharityUser[] charities;
        mapping(address => uint256) childAddressToId;
        mapping(address => bool) isChild;
        mapping(address => bool) isPool;
    }
    struct Child {
        address child;
        uint256 birthday;
        uint256 stakeProportion;
        mapping(uint256 => uint256) balances;
        uint256 totalUSDRewards;
        bool hasNFT;
    }
    struct CharityUser {
        uint256 charityId;
        uint256 stakeProportion;
        mapping(uint256 => uint256) totalDonated;
    }
    struct Charity {
        address charityAddress;
        string name;
        string webpage;
        mapping(uint256 => uint256) balances;
        mapping(uint256 => uint256) totalDonated;
    }

    uint256 public stakingFee;
    uint256 public proportionDiscount;
    uint256 public mintNFTThreshold = 10 * 10 ** 18;
    address[] public tokens;
    address[] public priceFeeds;
    mapping(uint256 => uint256) public fotumBalances;
    Pool[] public pools;
    User[] public users;
    Charity[] public charities;
    
    mapping(uint256 => uint256[]) tokenIdToPoolIds;
    mapping(address => uint256) userAddressToId;
    mapping(address => uint256) charityAddressToId;
    mapping(address => uint256) poolAddressToId;
    mapping(address => bool) isUser;
    mapping(address => bool) isPool;
    mapping(address => bool) isCharity;
   
    
    address owner;
    address keeper;
    address governance;
    IFotumToken FotumToken;
    IFoutumNFT FotumNFT;

    constructor (
        address _governance, 
        address _fotumToken, 
        address _fotumNFT,
        uint256 _stakingFee, 
        uint256 _proportionDiscount
    ) {
        owner = msg.sender;
        governance = _governance;
        FotumToken = IFotumToken(_fotumToken);
        FotumNFT = IFoutumNFT(_fotumNFT);
        stakingFee = _stakingFee;//10 ** 18 = 100%
        proportionDiscount = _proportionDiscount; // 5 * 10 ** 17
        tokens.push(address(this));//No Native address
        priceFeeds.push(address(this));// TODO: ETH/USD
    }

    modifier onlyUser {
        require(isUser[msg.sender] == true, "User does not exist. Please make a deposit first.");
        _;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    modifier onlyGovernance {
        require(msg.sender == governance);
        _;
    }

    modifier onlyKeeper {
        require(msg.sender == keeper);
        _;
    }

    modifier onlyPools {
        require(isPool[msg.sender] == true);
        _;
    }

    function _setKeeper(address _keeper) external onlyOwner {
        keeper = _keeper;
    }

    /* FOTUM CREATE ACTIONS */

    /* Creates a new user without children */
    function createUser() external {
        uint256 userId = users.length;
        users.push();
        User storage user = users[userId];
        user.user = msg.sender;
        user.stakeProportion = 10 ** 18;
        userAddressToId[msg.sender] = userId;
        isUser[msg.sender] = true;
    }

    /* Adds a child to a given user */
    function addChild(address _user, address _childAddress, uint256 _childBirthday, uint256 _stakeProportion) external {
        uint256 userId = userAddressToId[_user];
        require (_stakeProportion <= 10 ** 18 - users[userId].stakeProportion - users[userId].stakingFee, "Stake proportion more than allowed.");
        users[userId].stakeProportion -= _stakeProportion;

        uint256 childId = users[userId].children.length;
        users[userId].children.push();
        Child storage child = users[userId].children[childId];
        child.child = _childAddress;
        child.birthday = _childBirthday;
        child.stakeProportion = _stakeProportion;

        users[userId].childAddressToId[_childAddress] = childId;
        users[userId].isChild[_childAddress] = true;
        
    }

    /* Adds a charity to a given user */
    function addCharity(address _user, address _charityAddress, uint256 _stakeProportion) external {
        uint256 userId = userAddressToId[_user];
        require(isCharity[_charityAddress], "Charity not approved by the DAO.");
        /* Discount Fee if user donates more than a given proportion */
        if (_stakeProportion >= proportionDiscount) {
            users[userId].stakingFee = stakingFee / 2;
        }
        require(_stakeProportion <= 10 ** 18 - users[userId].stakeProportion - users[userId].stakingFee, "Stake proportion more than allowed.");
        users[userId].stakeProportion -= _stakeProportion;

        uint256 charityId = users[userId].charities.length;
        users[userId].charities.push();
        CharityUser storage charity = users[userId].charities[charityId];
        charity.charityId = charityAddressToId[_charityAddress];
        charity.stakeProportion = _stakeProportion;
    }

    /* Sets staking proportions for User, Children and Charities */
    function setStakingProportions(
        address _user, 
        uint256[] calldata _childrenProportions, 
        uint256[] calldata _charitiesProportions
    ) external onlyUser {
        uint256 userId = userAddressToId[_user];
        User storage user = users[userId];
        /* Checks consistent dimensions of arrays */
        require(user.children.length == _childrenProportions.length, "Amount of children does not coincide");
        require(user.charities.length == _charitiesProportions.length, "Amount of charities does not coincide");

        /* Caluclates total amount to stake and verifies it is smaller than 100% - fee */
        uint256 totalProportionCharities;
        for (
            uint256 charityIndex = 0; 
            charityIndex < _charitiesProportions.length;
            charityIndex++
        ) {
            totalProportionCharities += _charitiesProportions[charityIndex];
        }

        uint256 totalProportionChildren;
        for (
            uint256 childrenIndex = 0; 
            childrenIndex < _childrenProportions.length;
            childrenIndex++
        ) {
            totalProportionChildren += _childrenProportions[childrenIndex];
        }

        if (totalProportionCharities >= proportionDiscount) {
            user.stakingFee = stakingFee / 2;
        }
        uint256 totalProportionDonation = totalProportionCharities + totalProportionChildren + stakingFee;
        require(totalProportionDonation <= 10 ** 18, "Proportion to donate exceeds maximum possible");
        user.stakeProportion = 10 ** 18 - totalProportionDonation;

        /* Set proportions for charities */
        for (
            uint256 charityIndex = 0; 
            charityIndex < _charitiesProportions.length;
            charityIndex++
        ) {
            user.charities[charityIndex].stakeProportion = _charitiesProportions[charityIndex];
        }
        /* Set proportions for children */
        for (
            uint256 childrenIndex = 0; 
            childrenIndex < _childrenProportions.length;
            childrenIndex++
        ) {
            user.children[childrenIndex].stakeProportion = _childrenProportions[childrenIndex];
        }
    }

    /* FOTUM STAKING ACTIONS */

    /* Deposits the amount of a given token, needs approval from user for ERC20 tokens */
    function deposit(uint256 _amount, uint256 _tokenId) external payable {
        if (_tokenId == 0) {
            payable(address(this)).transfer(_amount);
        } else {
            IERC20(tokens[_tokenId]).transferFrom(msg.sender, address(this), _amount);
        }
        uint256 userId = userAddressToId[msg.sender];
        uint256 userBalance = users[userId].balances[_tokenId];
        users[userId].balances[_tokenId] = userBalance + _amount;
    }

    /* Withdraws the amount of a given token */
    function withdraw(uint _amount, uint256 _tokenId) external onlyUser {
        uint256 userId = userAddressToId[msg.sender];
        uint256 userBalance = users[userId].balances[_tokenId];
        require(userBalance >= _amount, "Not enough balance to withdraw");

        users[userId].balances[_tokenId] -= _amount;
        if (_tokenId == 0) {
            payable(msg.sender).transfer(_amount);
        } else {
            IERC20(tokens[_tokenId]).transfer(msg.sender, _amount);
        }
    }

    /* Stakes the amount to the Pool */
    function stake(uint256 _amount, uint256 _poolId) external onlyUser{
        uint256 userId = userAddressToId[msg.sender];
        uint256 tokenId = pools[_poolId].supportedTokenId;
        uint256 tokenBalance = users[userId].balances[tokenId];
        require (tokenBalance < _amount, "Not enough funds in deposited balance to stake");
        users[userId].balances[tokenId] = tokenBalance - _amount;
        users[userId].stakedBalances[tokenId] += _amount;

        if (tokenId == 0){
            payable(pools[_poolId].pool).transfer(_amount);
        } else {
            IERC20(tokens[tokenId]).approve(pools[_poolId].pool, _amount);
        }
        (bool success, ) = pools[_poolId].pool.call(abi.encodeWithSignature("stake(uint256,address)", _amount, msg.sender));

        require(success, "Staking in pool failed");
        
    }

    /* Unstakes the amount to the Pool */
    function unstake(uint256 _amount, uint256 _poolId) external onlyUser {
        uint256 userId = userAddressToId[msg.sender];
        uint256 tokenId = pools[_poolId].supportedTokenId;
        uint256 balanceInPool = IPool(pools[_poolId].pool).getAmountStaked(msg.sender);
        require(_amount <= balanceInPool, "Not enough balance to unstake");

        (bool success, ) = pools[_poolId].pool.call(abi.encodeWithSignature("unstake(uint256,address)", _amount, msg.sender));
        require(success, "Unstaking in pool failed");

        users[userId].balances[tokenId] += _amount;
    }

    /* Allows child to claim all funds of his/her parent */
    function claimChildFunds(address _parent) external {
        uint256 parentId = userAddressToId[_parent];
        User storage user = users[parentId];
        require(user.isChild[msg.sender] == true, "Not a child of the given user");
        uint256 childId = user.childAddressToId[msg.sender];
        Child storage child = user.children[childId];
        uint256 ageInSeconds = (block.timestamp - child.birthday);
        require(ageInSeconds >= 18 * 365 * 24 * 60 * 60, "You are not yet 18 years old");

        /* Unstake amount from each pool */
        for (
            uint256 poolIndex = 0;
            poolIndex < pools.length;
            poolIndex++
        ) {
            address poolAddress = pools[poolIndex].pool;
            uint256 tokenId = pools[poolIndex].supportedTokenId;
            if (user.isPool[poolAddress] == true) {
                uint256 childAmount = IPool(poolAddress).getAmountStaked(_parent) * child.stakeProportion;
                user.stakedBalances[tokenId] -= childAmount;
                
                (bool success, ) = poolAddress.call(abi.encodeWithSignature("unstake(uint256,address)", childAmount, msg.sender));
                require(success, "Unstaking in pool failed");

            }
        }
        // Remove child from list by maintainig order?
        user.isChild[msg.sender] = false;

        /* Transfer each token separately */
        for (
            uint256 tokenIndex = 0;
            tokenIndex < tokens.length;
            tokenIndex ++
        ) {
            uint256 amount = child.balances[tokenIndex];
            if (amount > 0) {
                child.balances[tokenIndex] = 0;
                if (tokenIndex == 0) {
                    payable(msg.sender).transfer(amount);
                } else {
                    IERC20(tokens[tokenIndex]).transfer(msg.sender, amount);
                }
            }
        }
    }

    /* FOTUM DISTRIBUTION ACTIONS */

    /* Mints NFT for the given child*/
    function _mintNFT(address _user, address _child) internal {
        uint256 userId = userAddressToId[_user];
        require(users[userId].isChild[_child] == true, "Not a child of a given user");
        uint256 childId = users[userId].childAddressToId[_child];
        Child storage child = users[userId].children[childId];
        FotumNFT.createToken(_child, child.totalUSDRewards);
        child.hasNFT = true;
    }

    function distributeRewards(address _pool) external onlyPools {
        require (msg.sender == _pool);
        uint256 poolId = poolAddressToId[_pool];
        Pool storage pool = pools[poolId];
        uint256 tokenId = pool.supportedTokenId;
        uint256 tokenPriceUSD = uint256(IPriceFeed(priceFeeds[tokenId]).getLatestPrice());
        address[] memory poolUsers = IPool(_pool).users();
        
        for (
            uint256 userIndex;
            userIndex < poolUsers.length;
            userIndex++
        )
        {   
            uint256 tokenIdL2 = tokenId;//To prevent Stack too deep error
            address userAddress = poolUsers[userIndex];
            uint256 userId = userAddressToId[userAddress];
            User storage user = users[userId];

            /* Update rewards */
            uint256 userRewards = IPool(_pool).userToRewards(userAddress) - pool.userToRewards[userAddress];
            pool.userToRewards[userAddress] = IPool(_pool).userToRewards(userAddress);

            /* Calculate user fotum rewards in this epoch*/
            uint256 fotumRewards = userRewards * tokenPriceUSD;
            FotumToken.mint(userAddress, fotumRewards);


            /* Update Balances */
            uint256 remainingRewards = userRewards;
            /* Fotum Staking Fee */
            uint256 fotumRewardsFee = userRewards * user.stakingFee;
            fotumBalances[tokenId] += fotumRewardsFee;
            remainingRewards -= fotumRewardsFee;

            /* Children rewards*/
            Child[] storage children = user.children;
            for (
                uint256 childIndex = 0;
                childIndex < children.length;
                childIndex++
            ) {
                Child storage child = children[childIndex];
                uint256 childRewards = userRewards * child.stakeProportion;
                child.balances[tokenIdL2] += childRewards;
                child.totalUSDRewards += childRewards * tokenPriceUSD;
                if ( child.hasNFT == false && child.totalUSDRewards >= mintNFTThreshold) {
                    child.hasNFT = true;
                    _mintNFT(user.user, child.child);
                }
                remainingRewards -= childRewards;
            }
            /* Charity Rewards */
            CharityUser[] storage charitiesUser = user.charities;
            for (
                uint256 charityIndex = 0;
                charityIndex < charities.length;
                charityIndex++
            ) {
                CharityUser storage charityUser = charitiesUser[charityIndex];
                uint256 charityRewards = userRewards * charityUser.stakeProportion;
                charityUser.totalDonated[tokenIdL2] += charityRewards;
                charities[charityUser.charityId].balances[tokenIdL2] += charityRewards;
                remainingRewards -= charityRewards;
            }
            /* User Rewards */
            user.stakedBalances[tokenIdL2] += remainingRewards;
        }
        //getAmountUSD -> Mint FotumToken, Mint NFT
        

    }

    /* Distributes Donations */
    function distributeDonations() external onlyKeeper {
        for ( 
            uint256 charityIndex = 0;
            charityIndex < charities.length;
            charityIndex++
        ) {
            Charity storage charity = charities[charityIndex];
            /* Transfer native token */
            uint256 balanceNative = charity.balances[0];
            if (charity.balances[0] > 0) {
                charity.balances[0] = 0;
                payable(charity.charityAddress).transfer(balanceNative);
                charity.totalDonated[0] += balanceNative;
            }
            /* Transfer ERC20 tokens */
            for (
                uint256 tokenIndex = 1;
                tokenIndex < tokens.length;
                tokenIndex++
            ) {
                uint256 balanceERC20 = charity.balances[tokenIndex];
                if (balanceERC20 > 0) {
                    charity.balances[tokenIndex] = 0;
                    IERC20(tokens[tokenIndex]).transfer(charity.charityAddress, balanceERC20);
                    charity.totalDonated[tokenIndex] += balanceERC20;
                }
                
            }
        }
    }

    /* FOTUM OWNER ACTIONS */

    /* Add a compatible ERC20 to the list of tokens */
    function _addERC20(address _tokenAddress, address _priceFeedAddress) external onlyOwner {
        tokens.push(_tokenAddress);
        priceFeeds.push(_priceFeedAddress);
    }

    /* Adds a Pool to Fotum */
    function _addPool(address _poolAddress, uint256 _tokenId) external onlyOwner {
        uint256 poolId = pools.length;
        pools.push();
        Pool storage pool = pools[poolId];
        pool.pool = _poolAddress;
        pool.supportedTokenId = _tokenId;
        isPool[_poolAddress] = true;
    }

    function _fotumWithdraw(uint256 _tokenId, uint256 _amount) external onlyOwner {
        uint256 tokenBalance = fotumBalances[_tokenId];
        require(tokenBalance >= _amount, "Not enough balance to withdraw");
        fotumBalances[_tokenId] -= _amount;
        if (_tokenId == 0) {
            payable(msg.sender).transfer(_amount);
        } else {
            IERC20(tokens[_tokenId]).transfer(msg.sender, _amount);
        }
    }

    /* TODO: removepool */

    /* FOTUM GOVERNANCE ACTIONS */

    /* Adds a new charity to the list */
    function _addCharity(address _charityAddress, string memory _name, string memory _website) external onlyGovernance {
        uint256 charityId = charities.length;
        charities.push();
        Charity storage charity = charities[charityId];
        charity.charityAddress = _charityAddress;
        charity.name = _name;
        charity.webpage = _website;
        charityAddressToId[_charityAddress] = charityId;
        isCharity[_charityAddress] = true;
    }

    /* TODO: remove charity */


    // function withdraw(address _charity) external onlyGovernance {
    //     _charity.transfer(address(this).balance - totalBalance) 
    // }

    /* READING FUNCTIONS */

    function fetchPoolsData() public view returns (
        address[] memory, 
        uint256[] memory, 
        uint256[] memory
    ) {
        address[] memory poolAddresses = new address[](pools.length);
        uint256[] memory totalStakedAmounts = new uint256[](pools.length);
        uint256[] memory supportedTokenIds = new uint256[](pools.length);
        for (
            uint256 poolIndex = 0;
            poolIndex < pools.length;
            poolIndex++
        ) {
            poolAddresses[poolIndex] = pools[poolIndex].pool;
            totalStakedAmounts[poolIndex] = pools[poolIndex].totalStakedAmount;
            supportedTokenIds[poolIndex] = pools[poolIndex].supportedTokenId;
        }
        return (poolAddresses, totalStakedAmounts, supportedTokenIds);
    }
}