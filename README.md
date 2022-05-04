# SERV Series
<b>WHY</b>
There are thousands of charitable organizations, non profits, and individuals who actively donate their resources to an important cause. The issue here is that with traditional financial systems, there’s no way to prove and assure the donors that their money is going to the cause intended. There have been countless investigations into charities concerning misuse of funds. 

<b>WHAT</b>
SERV Series is a product that addresses this issue in an innovative and fun way! It uses NFT technology to facilitate charities, leveraging the transparency and programmability of blockchains along with the principle of digital ownership associated with NFTs to create a unique, rewarding, and memorialized experience for donors and recipients. 
Here are some of the key differences that sets us apart from other charities in the space. 
<ul>
<li>
 Upon purchase, the NFT holders will automatically be entered into a lottery. If there is a winner they will receive a percentage of the profits from all NFT purchases in that Series collection. This creates an additional incentive for customers to participate in charities along with the incentive of donating to a cause in which they believe and value.
 </li>
<li>
 We will strive to have creative and high quality NFTs so they can be sold for profit. There will be a royalty fee for each NFT sale, half of which will go to the charity associated with the NFT series, creating limitless opportunities for charities to benefit from resales.
 </li>
</ul>
This idea came about because I desperately wanted to find a way to consistently push money into different communities and causes while bringing value to all parties involved. There are near and long term plans to provide more value and utility for both the donors and recipients. One example would be creating a DAO for the donors to build a community around philanthropy and vote on which charities to donate.


<b>HOW</b>

This is made possible by developing NFT smart contracts in Solidity on the Ethereum blockchain that are programmed to automatically facilitate the charity and lottery simultaneously. 

<b>Here is an overview of the tech stack..</b>

The smart contracts implemented in Solidity use various libraries from OpenZeppelin and Chainlink VRF V2 (to provide randomness necessary for lottery)
IDEs used include Remix and VSCode.

<b>Smart contract deployment involves a suit of tools comprising of: </b>

<b>Deployment:</b> Ethereum Rinkeby Testnet (Also tested deployment with Binance BNB and Polygon Mumbai testnets)

<b>Testing:</b> Hardhat waffle, Mocha, Chai, Code Coverage, Slither

<b>Build Tools:</b> Hardhat (Also tested with Truffle and Ganache)

<b>Development Language and IDE Tools:</b> Solidity, Ethers.js (Also tested with Web3.js), Javascript, Remix, VScode


<b>Here is a high level overview of the smart contract from start to finish.</b>
<ol>
<li>
Inside of the smart contract there is a mint() function that mints a given number of NFTs onto the Ethereum blockchain and is posted onto the OpenSea marketplace. NFTs are then available for purchase.
</li>

<li>
 Once all of the NFTs in the collection are sold, the lottery is triggered by calling the requestRandomWords() function that requests a random word from the Chainlink VRF V2 oracle. Chainlink VRF (Verifiable Random Function) is a secure way to produce a random number for your smart contract without compromising security. Unlike centralized oracles, Chainlink provides cryptographic proof of how that number was determined. 
</li>

<li>
 Once that number is received, the fulfillRandomWords() function will be invoked. Then the winner will be picked from the inner function call pickWinner().
 An event is then transmitted and triggers the payOut() function that pays out the winner, charity and maintenance accounts. 
The NFTs are created using the Open Zeppelin ERC721 standard along with utilizing other Open Zeppelin tools and contracts like the IERC20 that allows the smart contract to become an approved spender of the wallet that collects the money from NFT purchases, that way it has permission to send the funds to the winner of the lottery, charity and maintenance addresses.  
 </li>

<li>
Remix and VScode are the IDEs that are being used to build this product. Remix has the benefit of a great UI for smart contracts but VScode allows more flexibility when installing dependencies and frameworks. 
Because smart contracts are immutable, we had to choose a test network to deploy to for testing the functionality of the smart contract. Ethereum (Rinkeby), Binance(BNB Chain) and Polygon(Mumbai) all have their own testnets. Even though Ethereum is more expensive with gas fees, Rinkeby was chosen because of its security and customer pool. 
</li>

<li>
 In the beginning stages Truffle and Ganache frameworks were used to deploy the contract onto the Rinkeby testnet work but we ultimately decided to go with Hardhat because of its testing, deploying and debugging features. 
</li>

<li>
 To ensure the code is not susceptible to attacks and working as intended, hardhat/waffle is used to create unit tests for the smart contract. Slither is being used to check the code for vulnerabilities. Code coverage is also being used (now at 70%) to increse the level of tested code.
</li>
</ol>
