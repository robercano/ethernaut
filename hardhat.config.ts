import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "hardhat-abi-exporter";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";

import "./tasks/accounts";
import "./tasks/clean";
import "./tasks/solveSamaritan";
import "./tasks/solveDoubleEntryPoint";
import "./tasks/solveMotorbike";

import { resolve } from "path";

import { config as dotenvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

import { getChainConfig, getHardhatChainConfig, getLocalhostChainConfig, getEtherscanApiKey } from "./hardhat.helpers";

dotenvConfig({ path: resolve(__dirname, "./.env") });

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS ? true : false,
        excludeContracts: [],
        src: "./contracts",
    },
    networks: {
        localhost: getLocalhostChainConfig(),
        hardhat: getHardhatChainConfig(),
        goerli: getChainConfig("goerli"),
        kovan: getChainConfig("kovan"),
        rinkeby: getChainConfig("rinkeby"),
        ropsten: getChainConfig("ropsten"),
        "arb-mainnet": getChainConfig("arb-mainnet"),
        "arb-rinkeby": getChainConfig("arb-rinkeby"),
        "ply-mainnet": getChainConfig("ply-mainnet"),
        "ply-mumbai": getChainConfig("ply-mumbai"),
        "opt-mainnet": getChainConfig("opt-mainnet"),
        "opt-kovan": getChainConfig("opt-kovan"),
        "palm-mainnet": getChainConfig("palm-mainnet"),
        "palm-rinkeby": getChainConfig("palm-rinkeby"),
    },
    paths: {
        artifacts: "./artifacts",
        cache: "./cache",
        sources: "./contracts",
        tests: "./test",
    },
    solidity: {
        compilers: [
            {
                version: "0.8.17",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1,
                    },
                },
            },
            {
                version: "0.6.0",
            },
            {
                version: "0.6.12",
            },
        ],
        overrides: {
            "contracts/challenges/DoubleEntryPoint.sol": {
                version: "0.6.0",
            },
            "contracts/challenges/Motorbike.sol": {
                version: "0.6.12",
            },
        },
    },
    typechain: {
        outDir: "typechain",
        target: "ethers-v5",
    },
    abiExporter: {
        path: "./abis",
        runOnCompile: true,
        clear: true,
        flat: false,
        only: [],
        spacing: 2,
        pretty: false,
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: getEtherscanApiKey(),
    },
};

export default config;
