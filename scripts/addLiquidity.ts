import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {
    const USDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const WETHAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

    const address = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    await helpers.impersonateAccount(address);
    const impersonatedSigner = await ethers.getSigner(address);

    const USDT = await ethers.getContractAt("IERC20", USDTAddress);
    const DAI = await ethers.getContractAt("IERC20", DAIAddress);
    const WETH = await ethers.getContractAt("IERC20", WETHAddress);

    const ROUTER = await ethers.getContractAt("IUniswap", UNIRouter);

    const amountADesired = ethers.parseUnits("3000", 6);
    const amountBDesired = ethers.parseUnits("3000", 18);
    const amountAMin = 0;
    const amountBMin = 0;

    await USDT.connect(impersonatedSigner).approve(UNIRouter, amountADesired);
    await DAI.connect(impersonatedSigner).approve(UNIRouter, amountBDesired);

    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    // const prevContractBalance = await
    const USDCBalBefore = await USDT.balanceOf(impersonatedSigner.address);
    const DAIBalBefore = await DAI.balanceOf(impersonatedSigner.address);
    const WETHBalBefore = await WETH.balanceOf(impersonatedSigner.address);

    console.log("USDT Balance Before Liq:", ethers.formatUnits(USDCBalBefore, 6));
    console.log("DAI Balance Before Liq:", ethers.formatUnits(DAIBalBefore, 18));
    console.log("WETH Balance Before Liq:", ethers.formatUnits(WETHBalBefore, 18));
    console.log("---------------------------------------------------------");

    const addLiqudityTx = await ROUTER.connect(impersonatedSigner).addLiquidity(
        USDTAddress,
        DAIAddress,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        UNIRouter,
        deadline
    );

    await addLiqudityTx.wait();

    const USDTBalAfter = await USDT.balanceOf(impersonatedSigner.address);
    const DAIBalAfter = await DAI.balanceOf(impersonatedSigner.address);
    const WETHBalAfter = await WETH.balanceOf(impersonatedSigner.address);

    console.log("USDT Balance After Liq:", ethers.formatUnits(USDTBalAfter, 6));
    console.log("DAI Balance After Liq:", ethers.formatUnits(DAIBalAfter, 18));
    console.log("WETH Balance After Liq:", ethers.formatUnits(WETHBalAfter, 18));
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});