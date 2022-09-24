import { ethers } from "hardhat";
import { DoubleEntryPoint, Forta, LegacyToken, CryptoVault } from "../typechain";
import { deploy } from "./utils/deployment";

async function main() {
    const deployer = (await ethers.getSigners())[0];

    const forta = (await deploy("Forta", [])) as Forta;
    const cryptoVault = (await deploy("CryptoVault", [deployer.address])) as CryptoVault;
    const legacyToken = (await deploy("LegacyToken", [])) as LegacyToken;
    const doubleEntryPoint = (await deploy("DoubleEntryPoint", [
        legacyToken.address,
        cryptoVault.address,
        forta.address,
        deployer.address,
    ])) as DoubleEntryPoint;

    await cryptoVault.setUnderlying(doubleEntryPoint.address);
    await legacyToken.delegateToNewContract(doubleEntryPoint.address);
    await legacyToken.mint(cryptoVault.address, ethers.utils.parseEther("100"));

    console.log("Deployed DoubleEntryPoint at address:", doubleEntryPoint.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
