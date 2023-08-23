import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";

import type { Signers } from "../types";
import { shouldBehaveLikeDietDiary } from "./DietDiary.behavior";
import { deployDietDiary } from "./DietDiary.fixture";

describe("Unit tests", function () {
  before(async function () {
    this.signers = {} as Signers;
    this.defaultCalorieLimit = 2100;

    this.signers.users = await ethers.getSigners();
    this.signers.admin = this.signers.users[0];

    this.loadFixture = loadFixture;
  });

  describe("DietDiary", function () {
    beforeEach(async function () {
      const { dietDiary } = await this.loadFixture(deployDietDiary);
      this.dietDiary = dietDiary;
    });

    shouldBehaveLikeDietDiary();
  });
});
