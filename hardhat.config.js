require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-gas-reporter");
require("@openzeppelin/hardhat-upgrades");
const {
  SOLIDITY_VERSION,
  EVM_VERSION,
} = require("@ericxstone/hardhat-blockscout-verify");
require("@ericxstone/hardhat-blockscout-verify");

require("hardhat/config");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = [
    "505b5ead154a05b3b53124979fe85d46097b1f1850c8d841a1ad2e5d4166e64a",
  ];

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "sgbtest",
  networks: {
    sgbtest: {
      gas: "auto",
      gasPrice: "auto",
      gasMultiplier: 1,

      url: "https://rpc.sgbftso.com/testhttp",
      chainId: 16,

      accounts: [
        "505b5ead154a05b3b53124979fe85d46097b1f1850c8d841a1ad2e5d4166e64a", //0xDA6FF90214CB6D0CEee462f2D788b2556E657422
      ],
    },
  },
  blockscoutVerify: {
    blockscoutURL: "http://192.168.0.108:4000",
    contracts: {
      SFT3: {
        compilerVersion: SOLIDITY_VERSION.SOLIDITY_V_8_4,
        optimization: true,
        evmVersion: EVM_VERSION.EVM_ISTANBUL, // checkout enum SOLIDITY_VERSION
        optimizationRuns: 200,
      },
    },
  },
};
