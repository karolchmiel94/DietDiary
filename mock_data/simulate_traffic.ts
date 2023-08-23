import { HardhatRuntimeEnvironment } from "hardhat/types";

import { getCalorieLimits, getFoodEntries } from "./diet_diary_data_mock";

export async function simulateTraffic(hre: HardhatRuntimeEnvironment, address: string) {
  const contract = await hre.ethers.getContractAt("DietDiary", address);
  const accounts = await hre.ethers.getSigners();

  const calorieLimits = getCalorieLimits();
  for (let i = 0; i < calorieLimits.length; i++) {
    console.log("Changing calorie limit for acc: %s to %d", calorieLimits[i].account, calorieLimits[i].limit);
    await contract.changeCaloriesLimit(calorieLimits[i].limit, calorieLimits[i].account);
  }

  console.log("Calorie limit: %d", await contract.getCaloriesLimit());

  const foodEntries = getFoodEntries();

  const foodEntriesByDays = foodEntries;
  console.log("number of food entries: %d", foodEntriesByDays.length);

  var iter = 1;
  var dayNumber = 1;

  for (let day of foodEntriesByDays.slice(0, 3)) {
    console.log("Day %d", dayNumber);
    for (let user of day) {
      for (let entry of user.entries) {
        console.log("Adding food entry %s for user %s", entry, accounts[user.id]);
        await contract.connect(accounts[user.id]).addEntry(entry.calories, entry.name);
        console.log("Added entry nr: %d", iter);
        ++iter;
      }
    }

    console.log("passing time...");

    // pass a day
    await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 1]);
    await hre.ethers.provider.send("evm_mine");
    ++dayNumber;
  }

  // Pass a week
  await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 7]);
  await hre.ethers.provider.send("evm_mine");

  for (let day of foodEntriesByDays.slice(-3)) {
    console.log("Day %d", dayNumber);
    for (let user of day) {
      for (let entry of user.entries) {
        // console.log("Adding food entry %s for user %s", entry, accounts[user.id]);
        await contract.connect(accounts[user.id]).addEntry(entry.calories, entry.name);
        console.log("Added entry nr: %d", iter);
        ++iter;
      }
    }

    console.log("passing time...");
    await hre.ethers.provider.send("evm_increaseTime", [60 * 60 * 24 * 1]);
    await hre.ethers.provider.send("evm_mine");
    ++dayNumber;
  }

  console.log("Finished adding food entries");
}
