import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:numberOfEntries", "Get number of entries in last week and a week before it.")
  .addParam("contract", "Contract's address")
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
    console.log(entries);

    let today = new Date();
    let todayDayNumber = getDayNumber(today);
    console.log("Today timestamp: %d", todayDayNumber);

    let lastWeek = new Date(new Date().setDate(new Date().getDate() + 7));
    let lastWeekDayNumber = getDayNumber(lastWeek);
    console.log("LastWeek timestamp: %d", lastWeekDayNumber);

    let previousWeek = new Date(new Date().setDate(new Date().getDate() + 14));
    let previousWeekDayNumber = getDayNumber(previousWeek);
    console.log("PreviousWeek timestamp: %d", previousWeekDayNumber);

    let lastWeekEntries = entries.filter(
      (item) => item.timestamp < lastWeekDayNumber && item.timestamp >= todayDayNumber,
    );

    let previousWeekEntries = entries.filter(
      (item) => item.timestamp < previousWeekDayNumber && item.timestamp >= lastWeekDayNumber,
    );

    console.log("Last week entries count: %d", lastWeekEntries.length);
    console.log("Previous week entries count: %d", previousWeekEntries.length);
  });

function getDayNumber(date: Date): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 8.64e7);
}
