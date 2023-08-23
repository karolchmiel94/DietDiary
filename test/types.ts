import type { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/dist/src/signer-with-address";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

import { DietDiary } from "../types";

type Fixture<T> = () => Promise<T>;

declare module "mocha" {
  export interface Context {
    dietDiary: DietDiary;
    loadFixture: <T>(fixture: Fixture<T>) => Promise<T>;
    signers: Signers;
  }
}

export interface Signers {
  users: HardhatEthersSigner[];
  admin: SignerWithAddress;
}
