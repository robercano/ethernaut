import { ethers } from "hardhat";
import { Motorbike, Engine } from "../typechain";

async function main() {
    const EngineFactory = await ethers.getContractFactory("Engine");
    const Engine = (await EngineFactory.deploy()) as Engine;

    const MotorbikeFactory = await ethers.getContractFactory("Motorbike");
    const Motorbike = (await MotorbikeFactory.deploy(Engine.address)) as Motorbike;

    console.log("Deployed Engine at address:", Engine.address);
    console.log("Deployed Motorbike at address:", Motorbike.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
