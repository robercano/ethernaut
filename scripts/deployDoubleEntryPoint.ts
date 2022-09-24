import { ethers } from "hardhat";
import { DoubleEntryPoint, Forta, LegacyToken, CryptoVault } from "../typechain";
import { deploy } from "./utils/deployment";

async function main() {
    const doubleEntryPointFactory = await ethers.getContractFactory("DoubleEntryPoint");
    const doubleEntryPoint = (await doubleEntryPointFactory.deploy()) as DoubleEntryPoint;

    const forta = (await deploy("Forta", [], 0)) as Forta;
    const cryptoVault = (await deploy("CryptoVault", [])) as CryptoVault;
    const legacyToken = (await deploy("LegacyToken", [])) as LegacyToken;
    const doubleEntryPoint = (await deploy("DoubleEntryPoint", [])) as DoubleEntryPoint;

    console.log("Deployed DoubleEntryPoint at address:", doubleEntryPoint.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
