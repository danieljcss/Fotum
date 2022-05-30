const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  const USDC_INITIAL_SUPPLY = ethers.utils.parseEther('1000000')
  const TESTPOOL_INTERVAL_REWARD = 261157876067812 // 0.026...% per Interval 
  const TESTPOOL_UPDATE_INTERVAL = 10
  const FOTUM_TOKEN_INITIAL_SUPPLY = ethers.utils.parseEther('100')
  const TIMELOCK_MIN_DELAY = 120

  const FOTUM_STAKING_FEE = ethers.utils.parseEther('0.1')
  const FOTUM_PROPORTION_DISCOUNT = ethers.utils.parseEther('0.5')

  const FOTUM_UPDATE_BALANCES_INTERVAL = 60 // 60 seconds = 1 day
  const FOTUM_DISTRIBUTE_DONATIONS_INTERVAL = 60 * 28 // 4 weeks
  const FOTUM_UPDATE_DYNAMIC_NFT_INTERVAL = 60 // 60 seconds = 1 day

  let fotumDeployer, poolDeployer, usdcDeployer
  [fotumDeployer, poolDeployer, usdcDeployer] = await ethers.getSigners()

  const USDC = await ethers.getContractFactory("USDC", usdcDeployer)
  const TestPool = await ethers.getContractFactory("TestPool", poolDeployer)
  const Fotum = await ethers.getContractFactory("Fotum", fotumDeployer)
  const FotumNFT = await ethers.getContractFactory("FotumNFT", fotumDeployer)

  //Governance
  const FotumToken = await ethers.getContractFactory("FotumToken", fotumDeployer)
  const TimeLock = await ethers.getContractFactory("TimeLock", fotumDeployer)
  const FotumGovernance = await ethers.getContractFactory("FotumGovernance", fotumDeployer)

  //Keepers
  const FotumBalancesKeeper = await ethers.getContractFactory("FotumBalancesKeeper", fotumDeployer)
  const FotumDonationKeeper = await ethers.getContractFactory("FotumDonationKeeper", fotumDeployer)
  const FotumDynamicNFTKeeper = await ethers.getContractFactory("FotumDynamicNFTKeeper", fotumDeployer)

  //Connector
  const PoolConnector = await ethers.getContractFactory("PoolConnector", fotumDeployer)

  // DEPLOY
  const usdc = await USDC.deploy(USDC_INITIAL_SUPPLY);
  await usdc.deployed();
  console.log("USDC deployed to:", usdc.address);

  const testPool = await TestPool.deploy(
    usdc.address,
    TESTPOOL_INTERVAL_REWARD,
    TESTPOOL_UPDATE_INTERVAL
  )
  await testPool.deployed()
  console.log("TestPool deployed to:", testPool.address)

  const fotumToken = await FotumToken.deploy(FOTUM_TOKEN_INITIAL_SUPPLY)
  await fotumToken.deployed()
  console.log("Fotum Token deployed to:", fotumToken.address)

  const timeLock = await TimeLock.deploy(TIMELOCK_MIN_DELAY, [], [])
  await timeLock.deployed()
  console.log("TimeLock deployed to:", timeLock.address)

  const fotumGovernance = await FotumGovernance.deploy(
    fotumToken.address,
    timeLock.address
  )
  await fotumGovernance.deployed()
  console.log("Fotum Governance deployed to:", fotumGovernance.address)

  const fotumNFT = await FotumNFT.deploy()
  await fotumNFT.deployed()
  console.log("Fotum NFT deployed to:", fotumNFT.address)

  const fotum = await Fotum.deploy(
    fotumGovernance.address,
    usdc.address,
    fotumNFT.address,
    FOTUM_STAKING_FEE,
    FOTUM_PROPORTION_DISCOUNT
  )
  await fotum.deployed()
  console.log("Fotum deployed to:", fotum.address)

  const poolConnector = await PoolConnector.deploy(
    fotum.address,
    testPool.address,
    usdc.address
  )
  await poolConnector.deployed()
  console.log("Pool Connector deployed to:", poolConnector.address)

  const fotumBalancesKeeper = await FotumBalancesKeeper.deploy(
    fotum.address,
    FOTUM_UPDATE_BALANCES_INTERVAL
  )
  await fotumBalancesKeeper.deployed()
  console.log("Fotum Balances Keeper deployed to:", fotumBalancesKeeper.address)

  const fotumDonationKeeper = await FotumDonationKeeper.deploy(
    fotum.address,
    FOTUM_DISTRIBUTE_DONATIONS_INTERVAL
  )
  await fotumDonationKeeper.deployed()
  console.log("Fotum Donation Keeper deployed to:", fotumDonationKeeper.address)

  const fotumDynamicNFTKeeper = await FotumDynamicNFTKeeper.deploy(
    fotum.address,
    FOTUM_UPDATE_DYNAMIC_NFT_INTERVAL
  )
  await fotumDynamicNFTKeeper.deployed()
  console.log("Fotum Dynamic NFT Keeper deployed to:", fotumDynamicNFTKeeper.address)


  // Set Pools

  await fotum._addPool(poolConnector.address, 0)


  fs.writeFileSync('./config.js',
    `export const usdcAddress = "${usdc.address}"
  export const poolConnectorAddress = "${poolConnector.address}"
  export const fotumTokenAddress = "${fotumToken.address}"
  export const fotumAddress = "${fotum.address}"
  `)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
