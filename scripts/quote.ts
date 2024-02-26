import {ethers} from "hardhat";

let helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const UNISwapRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const uniSwap = await ethers.getContractAt("IUniSwap", UNISwapRouter);

    const amountIn = ethers.parseUnits("1", 18);
    const amounts = await uniSwap.getAmountsOut(amountIn, [DAIAddress, USDTAddress]);

    console.log("Amount out: ", ethers.formatUnits(amounts[1], 6));

}

main().catch((error) =>{
    console.log(error);
    process.exitCode = 1;
});