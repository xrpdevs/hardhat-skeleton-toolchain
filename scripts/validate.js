#!/usr/local/bin/node
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const fs = require('fs')

const hre = require("hardhat");
const { upgrades } = require("hardhat");
//const plugins_1 = require("hardhat/plugins");
// eslint-disable-next-line camelcase,node/no-unsupported-features/es-syntax
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

let contractData;
let verifyURL;

async function main() {
  const fname = "flattened/"+process.argv[2]+".sol";
  const todep = process.argv[3];
  const cAddr = process.argv[4];
  const isMain = process.argv[5];
  if(isMain === "main") {
    verifyURL = "https://songbird-explorer.flare.network/api?module=contract&action=verify";
  } else if(isMain === "sgb") {
    verifyURL = "http://10.64.0.6:4000/api?module=contract&action=verify";
  } else {
    verifyURL = "http://192.168.0.108:4000/api?module=contract&action=verify";
  }
  fs.readFile(fname, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    contractData = data;
  });
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await hre.ethers.getSigners();

  console.log("Validating contract at "+verifyURL);

//  console.log("Account balance:", (await deployer.getBalance()).toString());
  // const Factory = await hre.ethers.getContractFactory(todep);
  // const Token = await hre.ethers.getContractFactory("SFT6");
  // const token = await upgrades.deployProxy(Token);
  // const token = await upgrades.upgradeProxy(
  //    "0xdFeB7119603a722F623b6Ea7F2ABEaAD50559f12",
  //    Token
  //  );
  // const token = await upgrades.deployProxy(
  //   Token,
  //  ["0xbADF00D6387958a3E7747C0A0CF5E5a06dcc90c0"],
  //  { deployer, initializer: "setAdmin" }
  // );
  //  const factory = await Factory.deploy();
  // //const token = await Token.deploy();

  //  console.log("Deploy address:", factory.address);
  const factory = {};
  factory.address = cAddr;
  // console.log("Token address:", token.address);
  try {
    let bob;
    const params = {
      addressHash: factory.address,
      name: todep,
      compilerVersion: "v0.8.4+commit.c7e474f2",
      optimization: true,
      contractSourceCode: contractData,
      autodetectConstructorArguments: "true",
      evmVersion: "istanbul",
      optimizationRuns: 200,
    };
    const verifyRes = await fetch(
      verifyURL,
     //   `https://songbird-explorer.flare.network/api?module=contract&action=verify`,
      {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log(params)
    // clearInterval(loader);
    if (verifyRes.status === 200) {
      const data = await verifyRes.text();
      if (data.includes('{"message":"OK",')) {
        console.log(`${todep} is verified`);
      } else {
        console.log(data);
      }
    } else {
  //    console.log(data);
      console.log(verifyRes.status)
    }
  } catch (e) {
    console.log(e.toString());
    console.log(data);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
