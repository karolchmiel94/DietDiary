import { ethers } from "hardhat";

import type { DietDiary } from "../../types";

export async function deployDietDiary(): Promise<{ dietDiary: DietDiary }> {
  const signers = await ethers.getSigners();
  const admin = signers[0];

  const dietDiaryFactory = await ethers.getContractFactory("DietDiary");
  const defaultCalorieLimit = 2100;
  const dietDiary = await dietDiaryFactory.connect(admin).deploy(defaultCalorieLimit);
  await dietDiary.waitForDeployment();

  return { dietDiary };
}
