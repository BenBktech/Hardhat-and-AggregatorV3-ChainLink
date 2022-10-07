const { deployments, ethers, getNamedAccounts } = require("hardhat");
const { assert, expect } = require("chai");

describe("FundMe", async function() {
    let fundMe
    let deployer
    let mockV3Aggregator
    const sendValue = ethers.utils.parseEther("1")

    beforeEach(async function() {
        //deploy our fundMe contract using hardhat-deploy
        //deploy everything in one line
        //const accounts = await ethers.getSigners()
        //const accountZero = accounts[0]
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
    })

    describe("constructor", async function() {
        it("sets the aggregator addresses correctly", async function() {
            const response = await fundMe.priceFeed()
            assert.equal(response, mockV3Aggregator.address)
        })
    })

    describe("fund", async function() {
        it("Fails if you don't send enough ETH", async function() {
            await expect(fundMe.fund()).to.be.reverted;
        })
        it("update the amount funded data structure", async function() {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(
                deployer
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of funders", async function() {
            await fundMe.fund({ value: sendValue })
            const funder = await fundMe.funders(0);
            assert.equal(funder, deployer)
        })
    })
})