import { DoubleEntryPoint, CryptoVault, Forta__factory } from "../typechain";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("solveDoubleEntryPoint", "Solves the Double Entry Point challenge")
    .addParam("doubleEntryPointAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.doubleEntryPointAddress)) {
            throw new Error(`Invalid contract address format: ${args.doubleEntryPointAddress}`);
        }

        const player = (await hre.ethers.getSigners())[0];

        const doubleEntryPointFactory = await hre.ethers.getContractFactory("DoubleEntryPoint");
        const doubleEntryPoint = (await doubleEntryPointFactory.attach(
            args.doubleEntryPointAddress,
        )) as DoubleEntryPoint;

        const cryptoVaultAddress = await doubleEntryPoint.cryptoVault();
        const cryptoVaultFactory = await hre.ethers.getContractFactory("CryptoVault");
        const cryptoVault = (await cryptoVaultFactory.attach(cryptoVaultAddress)) as CryptoVault;

        const legacyTokenAddress = await doubleEntryPoint.delegatedFrom();

        const fortaAddress = await doubleEntryPoint.forta();
        const forta = await hre.ethers.getContractAt("Forta", fortaAddress);

        const solutionFactory = await hre.ethers.getContractFactory("DoubleEntryPointSolution");
        const solution = await solutionFactory.deploy(forta.address, cryptoVault.address);

        await forta.setDetectionBot(solution.address);

        try {
            await cryptoVault.sweepToken(legacyTokenAddress);
        } catch (err) {
            if (String(err).includes("Alert has been triggered, reverting")) {
                console.log("Vault has been protected!");
                return;
            }
        }

        console.log("Vault has not been protected!");
    });
