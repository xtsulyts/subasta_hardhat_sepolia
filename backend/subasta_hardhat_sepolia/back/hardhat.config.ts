import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition";
import * as dotenv from "dotenv";

// Cargar variables de entorno desde .env
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || ""],
    },
    // localhost: {
    //   url: "http://127.0.0.1:8545",
    // },
    
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY, // API Key de Etherscan
  },
};

export default config;