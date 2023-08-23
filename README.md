# karolch94

## Name

DietDiary

## Description

Never have time to think about how many calories you're injesting throughout the day?

Just use our intuitive tool to report your daily food intake, and regain control of your eating habits!

## Installation

Installation and setting this project up requires Node.js (ver. 16.18.1+), that can be downloaded from Node.js
[website.](https://nodejs.org/en).

Etherum development environment used for this project is [Hardhat](https://hardhat.org/).

Using it requires a Node package manager. Manager of my choice was [pnpm](https://pnpm.io/installation). There's few
ways of installing it, either with npm:

```bash
npm install -g pnpm
```

or some software package management system like Homebrew:

```bash
brew install pnpm
```

Once we have Node.js and a package manager installed, we can install project dependencies:

```bash
pnpm install
```

Before running any scripts, we need to set up a mnemonic password for Hardhat. The easiest way to do it is to copy
example environemntal variables, and changing the phrase.

```bash
cp .env.example .env
```

Example env file contains a default mnemonic phrase, but it's highly recommended to switch it. It can be done with any
website offering mnemonic generation like [mnemonicgenerator.](https://www.mnemonicgenerator.com/)

## Usage

Project contains a deployment script that automatically deploys the smart contract onto the local network.

We can run a local network, and deploy the contract with a command:

```bash
pnpm hardhat node
```

## Test and Deploy

Smart contract code has been tested using unit tests with Chai framework.

Test can be run with a command:

```bash
pnpm hardhat test
```

### Analytics and reporting

For admin reporting purposes, two commands have been prepared to retreieve info about user entries from the smart
contract.

### - Average number of calories added per user for the last 7 days

```bash
pnpm hardhat task:averageCalories
```

Arguments:

- address: deployed smart contract address,
- account: address of the user to retrieve info for,

Example of command retrieving info about average calories intake from a user on a locally deployed contract:

```bash
pnpm hardhat task:averageCalories --address 0xF5aA8e3C6BA1EdF
766E197a0bCD5844Fd1ed8A27 --account 0xB3A9140EFc7e5B395c41b93d02385f0444c9fE53 --network localhost
```

### - Number of entries added in the last week and the week prior

```bash
pnpm hardhat task:numberOfEntries
```

Arguments:

- address: deployed smart contract address,

Example of command retrieving info about average calories intake from a user on a locally deployed contract:

```bash
pnpm hardhat task:numberOfEntries --contract 0xF5aA8e3C6BA1EdF766E197a0bCD5844Fd1ed8A27 --network localhost
```

## Roadmap

The functionality of the project is finished, but there could be more work put into the reporting and analytics. The
reporting of `FoodEntries` is based on `Events` logged from the contract. Their data is stored properly, but the
limitiations of filtering data from the logs makes it difficult to get data based on complex conditions.

Implementing a tool to index data from the Ethereum blockchain would be recommended. There's plenty of them to choose
from on the market, like The Graph, Goldsky or ZettaBlock, being some of the biggest and most known products supporting
those features.

## Project status

Project is fully functional and ready to be used. There could be a better solution done around fetching data from
blockchain, with some use of an indexer.
