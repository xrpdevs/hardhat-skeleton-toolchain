#!/usr/local/bin/node
/// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

//import {Contract} from "ethers";

const tproxyABI = JSON.parse('[{"inputs":[{"internalType":"address","name":"_logic","type":"address"},{"internalType":"address","name":"admin_","type":"address"},{"internalType":"bytes","name":"_data","type":"bytes"}],"stateMutability":"payable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"}],"name":"AdminChanged","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"beacon","type":"address"}],"name":"BeaconUpgraded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"implementation","type":"address"}],"name":"Upgraded","type":"event"},{"stateMutability":"payable","type":"fallback"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"admin_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"changeAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"implementation","outputs":[{"internalType":"address","name":"implementation_","type":"address"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"}],"name":"upgradeTo","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newImplementation","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"upgradeToAndCall","outputs":[],"stateMutability":"payable","type":"function"},{"stateMutability":"payable","type":"receive"}]');


const fs = require("fs");
const hre = require("hardhat");
const { ethers, upgrades } = require("hardhat");
const { getImplementationAddress } = require('@openzeppelin/upgrades-core');

const tproxy = new ethers.utils.Interface(tproxyABI);


// const plugins_1 = require("hardhat/plugins");
// eslint-disable-next-line camelcase,node/no-unsupported-features/es-syntax
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

let contractData, verifyURL;

async function main() {
  const flatfile = "flattened/"+process.argv[2]+".sol";
  //const todep = process.argv[3];
  const todep = "contracts/"+process.argv[2]+".sol:"+process.argv[3];
  const acName = process.argv[3];
  //SGBFTSO_ERC721

  const isMain = process.argv[4];
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
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const Factory = await ethers.getContractFactory(todep);

//  const factory = await upgrades.deployProxy(Factory, [], {  kind: "transparent" });
  const factory = await upgrades.deployProxy(Factory);

 // let res = await upgrades.admin.changeProxyAdmin(factory.address, "0x20e8D37811b5EB44c4BB2bb15b1918EDa757dE78");


  const bob = await factory.deployed();

  console.log("Proxy address:", factory.address);

  //console.log(factory);
//  var wallet = new ethers.Wallet();




  const currentImplAddress = await upgrades.erc1967.getImplementationAddress(factory.address);
  const adminaddr = await upgrades.erc1967.getAdminAddress(factory.address);
  console.log("Implm address:", currentImplAddress);
  console.log("Admin address:", adminaddr);
  let contract = await factory.deployed();
  //factory.address = currentImplAddress;
  //console.log(contract);
  // //const factory = {};
  // factory.address = "0x7f0ecddb47b2e01ac8deb0af92f3d48fe7332f64";
  // console.log("Token address:", token.address);
  try {
    let bob;
    const params = {
      addressHash: currentImplAddress,
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
