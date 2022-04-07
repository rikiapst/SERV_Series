// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const Lottery = await hre.ethers.getContractFactory("Lottery");
  const lottery = await Lottery.deploy(
    "0xf57b2c51ded3a29e6891aba85459d600256cf317", 
    "0x6168499c0cFfCaCD319c818142124B7A15E857ab", 
    "0xc778417E063141139Fce010982780140Aa0cD5Ab", 
    "0x76e7180A22a771267D3bb1d2125A036dDd8344D9", 
    "0x76e7180A22a771267D3bb1d2125A036dDd8344D9", 
    1943
    );

  await lottery.deployed();

  console.log("lottery deployed to:", lottery.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });