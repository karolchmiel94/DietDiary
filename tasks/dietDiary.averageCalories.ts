import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:averageCalories", "Get average number of calories added per user for the last 7 days")
  .addParam("contract", "Contract's address")
  .addParam("address", "Address of the user")
  .setAction(async function (taskArguments: TaskArguments, { ethers }) {
    const contract = await ethers.getContractAt("DietDiary", taskArguments.contract);

    const eventFilter = contract.filters.FoodEntryCreated();
    let events = await contract.queryFilter(eventFilter);

    let entries = events.map((item) => {
      return {
        address: item.args[0],
        timestamp: Number(item.args[1]),
        calories: Number(item.args[2]),
      };
    });

    let today = new Date();
    let todayDayNumber = getDayNumber(today);
    console.log("Today timestamp: %d", todayDayNumber);

    let lastWeek = new Date(new Date().setDate(new Date().getDate() + 7));
    let lastWeekDayNumber = getDayNumber(lastWeek);
    console.log("LastWeek timestamp: %d", lastWeekDayNumber);

    let userEntries = entries.filter(
      (item) =>
        item.address == taskArguments.address && item.timestamp < lastWeekDayNumber && item.timestamp >= todayDayNumber,
    );

    console.log(userEntries);
    console.log("Number of entries: %d", userEntries.length);

    let entriesPerDay = Object.create({});
    for (let entry of userEntries) {
      const timestamp = entry.timestamp.toString();
      entriesPerDay[timestamp] = entriesPerDay[timestamp] ? entriesPerDay[timestamp] + entry.calories : entry.calories;
    }

    console.log(entriesPerDay);

    var calorieSum = 0;
    var daysSum = 0;
    for (let key in entriesPerDay) {
      calorieSum += entriesPerDay[key];
      daysSum += 1;
    }

    console.log("Calorie sum: %d", calorieSum);
    console.log("Days sum: %d", daysSum);

    console.log("Average calories per day: %d", calorieSum / daysSum);
  });

function getDayNumber(date: Date): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 8.64e7);
}
