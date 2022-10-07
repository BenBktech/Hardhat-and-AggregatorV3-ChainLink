const { deployments, ethers, getNamedAccounts } = require("hardhat");

describe("FundMe", async function() {
    let fundMe
    let deployer
    beforeEach(async function() {
        //deploy our fundMe contract using hardhat-deploy
        //deploy everything in one line
        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer);
    })

    describe("constructor", async function() {

    })
})