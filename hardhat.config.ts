import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const ALCHEMY_MAINNET_URL_KEY = process.env.ALCHEMY_MAINNET_URL_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    hardhat: {
      forking: {
        url: `${ALCHEMY_MAINNET_URL_KEY}`,
      }
    }
  }
};

export default config;
