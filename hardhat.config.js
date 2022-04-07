/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 require('solidity-coverage')
 
 const MNEMONIC = process.env.MNEMONIC;
 const API_KEY = process.env.API_KEY;

 require("@nomiclabs/hardhat-waffle");

 task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

module.exports = {
  solidity: "0.8.7",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${API_KEY}`,
      accounts: [MNEMONIC]
    },
    hardhat: {
    }
  },
  paths: {
    sources: "./contracts"
  },
};
