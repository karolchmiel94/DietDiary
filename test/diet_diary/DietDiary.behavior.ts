import { expect } from "chai";
import { ethers, network } from "hardhat";

import { passNetworkTimeByDays } from "../utils";

export function shouldBehaveLikeDietDiary(): void {
  it("should check the day number", async function () {
    const day = await this.dietDiary.getDayNumber();

    const now = new Date();
    const dayNumber = Math.floor((now.getTime() - now.getTimezoneOffset() * 60000) / 8.64e7);

    expect(Number(day)).to.be.equal(dayNumber);
  });

  it("should return calorie limit", async function () {
    expect(await this.dietDiary.connect(this.signers.admin).getCaloriesLimit()).to.equal(this.defaultCalorieLimit);
  });

  it("should set a calorie limit for an address", async function () {
    const userAddress = this.signers.users[1];
    const userLimit = 1000;

    await this.dietDiary.connect(this.signers.admin).changeCaloriesLimit(userLimit, userAddress);

    expect(await this.dietDiary.calorieLimitPerUser(userAddress)).to.be.equal(userLimit);
  });

  it("should revert if non admin tries to set calories limit", async function () {
    const userAddress = this.signers.users[1];
    const userLimit = 1000;

    await expect(
      this.dietDiary.connect(userAddress).changeCaloriesLimit(userLimit, userAddress),
    ).to.be.revertedWithCustomError(this.dietDiary, "PermissionDenied");
  });

  it("should add a food entry", async function () {
    const user = this.signers.users[1];
    const tx = await this.dietDiary.connect(user).addEntry(900, "Lasagna");
    const block = await ethers.provider.getBlock(tx.blockHash);

    expect(tx).to.emit(this.dietDiary, "FoodEntryCreated").withArgs(user.address, 900, block?.timestamp);
  });

  it("should revert if user adds entry exceeding calorie limit", async function () {
    const user = this.signers.users[1];

    await expect(this.dietDiary.connect(user).addEntry(2400, "Lasagna")).to.be.revertedWithCustomError(
      this.dietDiary,
      "CaloriesLimitExceeded",
    );
  });

  it("should revert adding food entry if threshold exceeded over all added entries this day", async function () {
    const user = this.signers.users[1];

    await this.dietDiary.connect(user).addEntry(1000, "Breakfast");
    await this.dietDiary.connect(user).addEntry(1000, "Dinner");

    await expect(this.dietDiary.connect(user).addEntry(400, "Supper")).to.be.revertedWithCustomError(
      this.dietDiary,
      "CaloriesLimitExceeded",
    );
  });

  it("should pass adding new food entries after a day passes", async function () {
    const user = this.signers.users[1];

    await this.dietDiary.connect(user).addEntry(1000, "Breakfast");
    await this.dietDiary.connect(user).addEntry(1000, "Dinner");
    await this.dietDiary.connect(user).addEntry(100, "Dinner");

    await passNetworkTimeByDays(1);

    expect(this.dietDiary.connect(user).addEntry(400, "Supper")).to.be.ok;
  });
}
