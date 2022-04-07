# SERV_Series_Test
SERV Series is comprised of a smart contract the produces multiple NFT collections(Series) to create a new way to donate to charities!

This is made possible by developing NFT smart contracts in Solidity on the Ethereum blockchain that are programmed to automatically facilitate the charity and lottery simultaneously. Here is a high level overview of the smart contract from start to finish.


Inside of the smart contract there is a mint() function that mints a given number of NFTs onto the Ethereum blockchain and is posted onto the OpenSea marketplace. NFTs are then available for purchase.

Once all of the NFTs in the collection are sold, the lottery is triggered by calling the requestRandomWords() function that requests a random word from the Chainlink VRF V2 oracle. Chainlink VRF (Verifiable Random Function) is a secure way to produce a random number for your smart contract without compromising security. Unlike centralized oracles, Chainlink provides cryptographic proof of how that number was determined. 

Once that number is received, the fulfillRandomWords() function will be invoked. Then the winner will be picked from the inner function call pickWinner().
 An event is then transmitted and triggers the payOut() function that pays out the winner, charity and maintenance accounts. 
The NFTs are created using the Open Zeppelin ERC721 standard along with utilizing other Open Zeppelin tools and contracts like the IERC20 that allows the smart contract to become an approved spender of the wallet that collects the money from NFT purchases, that way it has permission to send the funds to the winner of the lottery, charity and maintenance addresses.   

Remix and VScode are the IDEs that are being used to build this product. Remix has the benefit of a great UI for smart contracts but VScode allows more flexibility when installing dependencies and frameworks. 
Because smart contracts are immutable, we had to choose a test network to deploy to for testing the functionality of the smart contract. Ethereum (Rinkeby), Binance(BNB Chain) and Polygon(Mumbai) all have their own testnets. Even though Ethereum is more expensive with gas fees, Rinkeby was chosen because of its security and customer pool. 

In the beginning stages Truffle and Ganache frameworks were used to deploy the contract onto the Rinkeby testnet work but we ultimately decided to go with Hardhat because of its testing, deploying and debugging features. 

To ensure the code is not susceptible to attacks and working as intended, hardhat/waffle is used to create unit tests for the smart contract. Slither is being used to check the code for vulnerabilities. Code coverage is also being used to increse the level of tested code. 


