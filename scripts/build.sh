#!/bin/sh

cp work_dir/$1.sol contracts
npx hardhat compile
npx hardhat flatten >/tmp/a.tmp
cat /tmp/a.tmp | sed 's/\/\/ SPDX-License-Identifier: MIT//g' >/tmp/b.tmp
cat /tmp/b.tmp | sed 's/Sources flattened with hardhat/SPDX-License-Identifier: MIT\n\/\//g' >flattened/$1.sol
rm -f /tmp/a.tmp
rm -f /tmp/b.tmp
rm -f contracts/$1.sol

