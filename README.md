# Hardhat and AggregatorV3 by ChainLink with improved Deployment

Create the .env file and put these infos :

PRIVATE_KEY=xxx
GOERLI_RPC_URL=xxx
ETHERSCAN_API_KEY=xxx

Then, deploy with the command : 

yarn hardhat deploy --network goerli

Mocks functionnality : you can also deploy on a local hardhat test network with :

yarn hardhat deploy

To test :

yarn hardhat test
yarn hardhat coverage

Just a tip : You can also debbug directly in Solidity by using the Hardhat console :
https://hardhat.org/tutorial/debugging-with-hardhat-network