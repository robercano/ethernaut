import { ethers } from "hardhat";
import { GoodSamaritan } from "../typechain";

async function main() {
    const goodSamaritanFactory = await ethers.getContractFactory("GoodSamaritan");
    const goodSamaritan = (await goodSamaritanFactory.deploy()) as GoodSamaritan;

    console.log("Deployed GoodSamaritan at address:", goodSamaritan.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
