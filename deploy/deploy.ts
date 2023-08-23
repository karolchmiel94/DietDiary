import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { simulateTraffic } from "../mock_data/simulate_traffic";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const dietDiary = await deploy("DietDiary", {
    from: deployer,
    args: [4400],
    log: true,
  });

  console.log(`DietDiary contract: `, dietDiary.address);

  console.log("Simulating user traffic...");
  await simulateTraffic(hre, dietDiary.address);
};
export default func;
func.id = "deploy_diet_diary"; // id required to prevent reexecution
func.tags = ["DietDiary"];
