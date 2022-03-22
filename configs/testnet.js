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

  /// NOTE: replace 00000000000000 with private key of deploy account here and below

  const accounts = [
    "00000000000000000000000000000000000000000000000000000000000",
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
        "0000000000000000000000000000000000000000000000000", 
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
