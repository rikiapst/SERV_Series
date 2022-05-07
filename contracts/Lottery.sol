// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

import "./ERC721Tradable.sol";
import "hardhat/console.sol";
import "./interfaces/IERC20.sol";



/**
 * @title Lottery
 * Lottery - a contract for my non-fungible Lotterys.
 proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
 */
contract Lottery is ERC721Tradable, VRFConsumerBaseV2 {
    VRFCoordinatorV2Interface COORDINATOR;
    LinkTokenInterface LINKTOKEN;
    IERC20 WETH;

    uint64 public s_subscriptionId;
    //address vrfCoordinator = 0x6168499c0cFfCaCD319c818142124B7A15E857ab;
    address link = 0x01BE23585060835E02B77ef475b0Cc51aA1e0709;
    bytes32 keyHash =
        0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc;
    uint32 callbackGasLimit = 100000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 2;
    uint32 public nftSold = 0;

    uint256[] public s_randomWords;
    uint256 public s_requestId;
    address s_owner;
   // address weth = 0xc778417E063141139Fce010982780140Aa0cD5Ab;

    uint256 winner; 
    uint256 public lotterytStart = 0;
    address public maintenance;
    //0x76e7180A22a771267D3bb1d2125A036dDd8344D9;
    address public charity;
    //0x76e7180A22a771267D3bb1d2125A036dDd8344D9;

    bytes32 contractURIVar;
    bytes32 baseTokenURIVar;

    event Winner(uint256 _requestId, uint256 _randomWords, uint256 _winner);
    event TransferFrom(address _from, address _to, uint256 _tokenId);
    event Airdrop(address _from, address _to, uint256 _tokenId);

    bool lotteryOpen = false;

    constructor(
        address _proxyRegistryAddress, address _vrfCoordinator, 
        address _weth, address _maintenance, address _charity, uint64 _s_subscriptionId
    )
        ERC721Tradable("Lottery", "OSC", _proxyRegistryAddress)
        VRFConsumerBaseV2(_vrfCoordinator)
    {
        COORDINATOR = VRFCoordinatorV2Interface(_vrfCoordinator);
        LINKTOKEN = LinkTokenInterface(link);
        s_owner = msg.sender;
        s_subscriptionId = _s_subscriptionId;
        WETH = IERC20(_weth);
        maintenance = _maintenance;
        charity = _charity;
    }

    function wethBalance() public view returns(uint){
       return WETH.balanceOf(s_owner);
    }

    function baseTokenURI() public pure override returns (string memory) {
        return "https://9j8kyzfpw3.execute-api.us-east-1.amazonaws.com/default/nft/";
    }

    function contractURI() public pure returns (string memory) {
        return "http://18.208.216.46/contract";
    }

    function setCharity(address _charity) public onlyOwner returns(address){
       charity = _charity;
       return charity;
   }

   function setMaintenance(address _maintenance) public onlyOwner returns(address){
       maintenance = _maintenance;
       return maintenance;
   }

    function setSubId(uint64 _s_subscriptionId) public onlyOwner returns(uint64) {
        s_subscriptionId = _s_subscriptionId;
        return s_subscriptionId;
    }
    

    function requestRandomWords() public{
        // Will revert if subscription is not set and funded.
        s_requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
    }

    function mint(uint32 numNfts) public onlyOwner {
         lotterytStart = this.totalSupply();
         nftSold = 0; 
         for (uint256 i = 0; i < numNfts; i++){
             this.mintTo(s_owner);
         }
         lotteryOpen = true;
    }


    function transferFrom (
        address from,
        address to,
        uint256 tokenId
    ) public override {
        require(to != s_owner, "cannot transfer to owner address");
        ERC721Tradable.transferFrom(from, to, tokenId);

        if (from == s_owner) {
            nftSold++;

             if (this.balanceOf(s_owner) == 0) {
                 lotteryOpen = false;
                 requestRandomWords();
             }
        }
         emit TransferFrom(from, to, tokenId);
         emit Airdrop(from, to, tokenId);
    }


    

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        s_randomWords = randomWords;    
        pickWinner();
        emit Winner(requestId, randomWords[0], winner + lotterytStart);
    }


    function getWinner() public  view returns(uint256)  {
        require(!lotteryOpen, "Lottery is not closed");
        return winner + lotterytStart;
    }

//PROXY ADDRESS 0xf57b2c51ded3a29e6891aba85459d600256cf317

   function getLotteryOpen() public view returns(bool){
       return lotteryOpen;
   }

   function pickWinner() internal returns(uint) {
        winner = (s_randomWords[0] % (nftSold * 2)) + 1;
        return winner;
   }


   function payOut() public onlyOwner {
        uint256 charityPayout = this.wethBalance() / 10;
        bool transferSuccess;
        transferSuccess = WETH.transferFrom(
            s_owner,
            maintenance,
            this.wethBalance() / 5 
        );

        require(transferSuccess, "transfer to maintenance account unsuccessful");
        
        if(winner <= nftSold){ 
            transferSuccess = WETH.transferFrom(
                s_owner,
                this.ownerOf(winner + lotterytStart),
                this.wethBalance() - charityPayout
            );
            require(transferSuccess, "transfer to winner account unsuccessful");
        } 
        else{
            charityPayout = this.wethBalance();
        }
        transferSuccess = WETH.transferFrom(
            s_owner,
            charity,
            charityPayout
        );
        require(transferSuccess, "transfer to charity account unsuccessful");
    }
 
}
