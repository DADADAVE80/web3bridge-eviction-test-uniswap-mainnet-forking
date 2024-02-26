import { ethers } from "hardhat";

const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const UniSwap = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const culpritAddress = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    await helpers.impersonateAccount(culpritAddress);
    const impersonatedSigner = await ethers.getSigner(culpritAddress);

    const USDT = await ethers.getContractAt("IERC20", USDTAddress);
    const WETH = await ethers.getContractAt("IERC20", WETHAddress);

    const UNIRouter = await ethers.getContractAt("IUniswap", UniSwap);

    const amountTokenDesired = ethers.parseUnits("5000", 6);
    const amountWETHDesired = ethers.parseEther("50");
    const amountTokenMin = 0;
    const amountETHMin = 0;

    await USDT.connect(impersonatedSigner).approve(UniSwap, amountTokenDesired);
    await WETH.connect(impersonatedSigner).approve(UniSwap, amountWETHDesired);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    //balanceOf before adding liquidity
    const USDTBalBefore = await USDT.balanceOf(impersonatedSigner.address);
    const WETHBalBefore = await WETH.balanceOf(impersonatedSigner.address);
    console.log("USDT Balance Before Liq:", ethers.formatUnits(USDTBalBefore, 6));
    console.log("WETH Balance Before Liq:", ethers.formatEther(WETHBalBefore));
    console.log("----------------------------------------------------------");

    //add liquidity
    const addLiquidityETHTx = await UNIRouter.connect(impersonatedSigner).addLiquidityETH(
        USDTAddress,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        culpritAddress,
        deadline,
        { value: amountWETHDesired }
    );

    await addLiquidityETHTx.wait();

    //balanceOf after adding liquidity
    const USDTBalAfter = await USDT.balanceOf(impersonatedSigner.address);
    const WETHBalAfter = await WETH.balanceOf(impersonatedSigner.address);
    console.log("USDT Balance After Liq:", ethers.formatUnits(USDTBalAfter, 6));
    console.log("WETH Balance After Liq:", ethers.formatEther(WETHBalAfter));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});