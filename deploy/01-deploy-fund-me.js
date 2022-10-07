const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

module.exports = async(hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    // if chainId is X use address y
    // if chainId is A use address z
    // ...
    //FOR LOCAL HARDHAT
    let ethUsdPriceFeedAddress 
    if(developmentChains.includes(network.name)) {
        //Get the contract MockV3Aggregator
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    }
    //FOR TESTNET
    else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
    }

    // if the contract does'nt exist, we deploy a minimal version of it for our local testing


    // what happens when we want to change chain
    // When going for localhost or hardhat network we want to use a mock
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //price feed address,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1
    })

    //We don't want to verify on a local network
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }

    log("----------------------------");
}

module.exports.tags = ["all", "fundme"]