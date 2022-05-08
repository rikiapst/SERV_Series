// 0x4B8085a9E55ADc4b0b8D5EE93FE3621d2770C065
// We import Chai to use its asserting functions here.
const { expect } = require("chai");
const { ethers } = require("hardhat");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("NFT contract", function () {
  // Mocha has four functions that let you hook into the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let lottery;
  let mockWETH;
  let mockProxyRegistry;
  let mockVFRCoordinator;
  let lotteryContract;
  let proxyContract;
  let vrfCoordinatorContract;
  let WETH;
  let owner;
  let maintenance;
  let charity;
  let addr1;
  let addr2;
  let addrs;
  let amount = 100;

  beforeEach(async function () {
    [owner, addr1, addr2, maintenance, charity, ...addrs] = await ethers.getSigners();

    mockWETH = await ethers.getContractFactory("MockWETH");
    WETH = await mockWETH.deploy(owner.address, amount);

    mockProxyRegistry = await ethers.getContractFactory("MockProxyRegistry");
    proxyContract = await mockProxyRegistry.deploy();

    mockVFRCoordinator = await ethers.getContractFactory("MockVRFCoordinator");
    vrfCoordinatorContract = await mockVFRCoordinator.deploy();

    lottery = await ethers.getContractFactory("Lottery");  
    lotteryContract = await lottery.deploy(
        proxyContract.address, vrfCoordinatorContract.address, WETH.address, maintenance.address, charity.address, 1943
    );
  });

  describe("Transactions", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.
    it("Should assign the total supply of tokens to the owner", async function () {
        await lotteryContract.mint(4);
        const ownerBalance = await lotteryContract.balanceOf(owner.address);
        expect(ownerBalance).to.equal(4);
    });

    it("Should open the lottery when owner balance is greater than zero", async function () {
      expect(await lotteryContract.getLotteryOpen()).to.equal(false);
      await lotteryContract.mint(1);
      expect(await lotteryContract.getLotteryOpen()).to.equal(true);
    });

    it("Should close the lottery when owner balance is zero", async function () {
      expect(await lotteryContract.getLotteryOpen()).to.equal(false);
      await lotteryContract.mint(1);
      expect(await lotteryContract.getLotteryOpen()).to.equal(true);
      await lotteryContract.transferFrom(owner.address, addr1.address, 1);
      expect(await lotteryContract.getLotteryOpen()).to.equal(false);
    });
    
    it("Should call request random words when all NFTs sold", async function () {
      expect(await vrfCoordinatorContract.requestRandomWordsCalled()).to.equal(false);
      await lotteryContract.mint(2);
      await lotteryContract.transferFrom(owner.address, addr1.address, 1);
      await lotteryContract.transferFrom(owner.address, addr1.address, 2);
      expect(await vrfCoordinatorContract.requestRandomWordsCalled()).to.equal(true);
    });
    
  });
  describe("Pay Out", function(){

    it("should have a WETH balance of 100", async function () {
      expect(await lotteryContract.wethBalance()).to.equal(amount);
    })

  })

  describe("getWinner", function(){
    it("should return 2 if lottery is closed ", async function () {
      await lotteryContract.mint(5);
      for(let i=1; i<6; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }
      expect(await lotteryContract.getWinner()).to.equal(5);
    })

    it("should revert if lottery is open ", async function () {
      await lotteryContract.mint(2);
      //expect(await lotteryContract.getLotteryOpen()).to.equal(true);
      await expect(lotteryContract.getWinner()).to.be.revertedWith("Lottery is not closed");
    })

    it("should result in a balance of zero WETH in the owners account when there is a winner", async function () {
      await lotteryContract.mint(5);
      for(let i=1; i<6; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }
      expect(await lotteryContract.getWinner()).to.equal(5);
      await lotteryContract.payOut()
      expect(await lotteryContract.wethBalance()).to.equal(0);

    })
  })

  describe("Pay Out if Winner", function (){

    it("should result in a balance of 20 WETH in the maintenance account when there is a winner", async function () {
      await lotteryContract.mint(5);
      for(let i=1; i<6; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }

      await lotteryContract.payOut()
      expect(await WETH.balanceOf(maintenance.address)).to.equal(20);
    })

    it("should result in a balance of 10 WETH in the charity account when there is a winner", async function () {
      await lotteryContract.mint(5);
      for(let i=1; i<6; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }

      await lotteryContract.payOut()
      expect(await WETH.balanceOf(charity.address)).to.equal(10);
    })

    it("should result in a balance of 70 WETH in the winners' account when there is a winner", async function () {
      await lotteryContract.mint(5);
      for(let i=1; i<6; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }

      await lotteryContract.payOut()
      expect(await WETH.balanceOf(addr1.address)).to.equal(70);
    })

    it("should result in a balance of 0 WETH in the owners account when there is a winner", async function () {
      await lotteryContract.mint(5);
      for(let i=1; i<6; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }
    
      await lotteryContract.payOut()
      expect(await WETH.balanceOf(owner.address)).to.equal(0);
    })
  })

  describe("Pay Out if No Winner", function (){

    it("should result in a balance of 20 WETH in the maintenance account when there is a NOT winner", async function () {
      await lotteryContract.mint(3);
      for(let i=1; i<4; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }
      await lotteryContract.payOut()
      expect(await WETH.balanceOf(maintenance.address)).to.equal(20);
    })

    it("should result in a balance of 80 WETH in the charity account when there is a not winner", async function () {
      await lotteryContract.mint(3);
      for(let i=1; i<4; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }

      await lotteryContract.payOut()
      expect(await WETH.balanceOf(charity.address)).to.equal(80);
    })

    it("should result in a balance of 0 WETH because there is no winner", async function () {
      await lotteryContract.mint(3);
      for(let i=1; i<4; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }
      await lotteryContract.payOut()
      expect(await WETH.balanceOf(addr1.address)).to.equal(0);
    })

    it("should result in a balance of 0 WETH in the owners account after calling payout", async function () {
      await lotteryContract.mint(3);
      for(let i=1; i<4; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }

      await lotteryContract.payOut()
      expect(await WETH.balanceOf(owner.address)).to.equal(0);
    })
  })

  describe("Set Functions", function(){
    it("should assign charity to input address", async function () {
      await lotteryContract.setCharity(addr1.address);
      expect(await lotteryContract.charity()).to.equal(addr1.address);

      await lotteryContract.setCharity(addr2.address);
      expect(await lotteryContract.charity()).to.equal(addr2.address);
    })

    it("should assign maintenance to input address", async function () {
      await lotteryContract.setMaintenance(addr1.address);
      await expect(await lotteryContract.maintenance()).to.equal(addr1.address);

      await lotteryContract.setMaintenance(addr2.address);
      await expect(await lotteryContract.maintenance()).to.equal(addr2.address);
    })

    it("should assign subscription ID to input subscription ID", async function () {
      await lotteryContract.setSubId(5);
      expect(await lotteryContract.s_subscriptionId()).to.equal(5);

      await lotteryContract.setSubId(7);
      expect(await lotteryContract.s_subscriptionId()).to.equal(7);

    })
  })

  describe("Burn funcion", function (){

    it("should burn the residual NFTs when burnResidual is called", async function () {
      await lotteryContract.mint(204);
      for(let i=1; i<5; i++){
        await lotteryContract.transferFrom(owner.address, addr1.address, i);
      }
      expect(await lotteryContract.totalSupply()).to.equal(204);
      expect(await vrfCoordinatorContract.requestRandomWordsCalled()).to.equal(false);
      expect(await lotteryContract.getLotteryOpen()).to.equal(true);
      await lotteryContract.burnResidual();
      expect(await lotteryContract.totalSupply()).to.equal(4);
      expect(await vrfCoordinatorContract.requestRandomWordsCalled()).to.equal(true);
      expect(await lotteryContract.getLotteryOpen()).to.equal(false);
    })
  });

  describe("Invalid transfer", function (){

    it("should revert invalid transfers", async function () {
      await lotteryContract.mint(1);
      await lotteryContract.transferFrom(owner.address, addr1.address, 1);
      await expect(lotteryContract.transferFrom(addr1.address, owner.address, 1)).to.be.revertedWith("cannot transfer to owner address");
    })
  });

});