import { ethers } from "hardhat";

export async function passNetworkTimeByDays(days: number) {
  await ethers.provider.send("evm_increaseTime", [60 * 60 * days]);
  await ethers.provider.send("evm_mine");
}

export function getDayNumber(date: Date): number {
  return Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 8.64e7);
}
