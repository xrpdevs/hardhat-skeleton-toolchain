#!/usr/local/bin/node
/// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const fs = require("fs");

const hre = require("hardhat");
const { upgrades } = require("hardhat");
// const plugins_1 = require("hardhat/plugins");
// eslint-disable-next-line camelcase,node/no-unsupported-features/es-syntax
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let contractData, verifyURL;

async function main() {
  const flatfile = "flattened/"+process.argv[2]+".sol";
  const isMain = process.argv[4];
  const todep = "contracts/"+process.argv[3]+".sol:"+process.argv[3];
  const acName = process.argv[3];
  if(isMain === "main") {
    verifyURL = "https://songbird-explorer.flare.network/api?module=contract&action=verify";
  } else if(isMain === "sgb") {
    verifyURL = "http://10.64.0.6:4000/api?module=contract&action=verify";
  } else {
    verifyURL = "http://192.168.0.108:4000/api?module=contract&action=verify";
  }
  fs.readFile(flatfile, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    contractData = data;
  });


  //const cAddr = process.argv[4];
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const Factory = await hre.ethers.getContractFactory(todep);
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
  const factory = await Factory.deploy("Test 1", "Test Sym", "https://ipfs.io/ipfs/fake", "https://ipfs.io/ipfs/fake2");
  // //const token = await Token.deploy();

  console.log("Deploy address:", factory.address);
  // //const factory = {};
  // factory.address = "0x7f0ecddb47b2e01ac8deb0af92f3d48fe7332f64";
  // console.log("Token address:", token.address);
  try {
    let bob;
    const params = {
      addressHash: factory.address,
      name: acName,
      compilerVersion: "v0.8.4+commit.c7e474f2",
      optimization: true,
      contractSourceCode: contractData,
      autodetectConstructorArguments: "true",
      evmVersion: "istanbul",
      optimizationRuns: 200,
    };
    const verifyRes = await fetch(
        verifyURL,
//      `http://192.168.0.108:4000/api?module=contract&action=verify`,
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
      console.log("ERROR");
    }
  } catch (e) {
    console.log(e.toString());
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
