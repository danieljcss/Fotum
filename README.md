# Fotum

Fotum is helping fulfill your children's dreams by providing crypto saving accounts built on top of your yield or staking rewards. By locking your children's funds, they receive dynamic NFTs that evolve with time. With Fotum you can also engage for other causes by donating part of your rewards to whitelisted institutions managed by Fotum DAO.

## Initialization

Necessary dependencies can be added by using

```bash
npm install
```

To initialize the local Hardhat network we use

```
npx hardhat node
```

Then we deploy the main Solidity files on a separate terminal by running

```
npx hardhat run scripts/deploy.js --network localhost
```

To start the Next.js app on a localhost we run

```
npm run dev
```

## Technologies used

- Solidity: smart contracts development
- Hardhat + Ethers: Deployment and testing
- React.js: Frontend components logic
- Next.js: React Framework
- Chakra UI: Styled frontend components
- Moralis: EVM node and react hooks for Web3 connection
- Chainlink: Keepers for contract automation, Price Feeds for DAO Governance token minting and VRF for NFT random minting
