// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";


/**
 * @dev A simple mock ProxyRegistry for use in local tests with minimal security
 */
contract MockVRFCoordinator is VRFCoordinatorV2Interface {
  bool public requestRandomWordsCalled = false;

  function getRequestConfig()
    external override
    view
    returns (
      uint16,
      uint32,
      bytes32[] memory
    ){
      return (1, 2, new bytes32[](1));
    }

  function requestRandomWords(
    bytes32 keyHash,
    uint64 subId,
    uint16 minimumRequestConfirmations,
    uint32 callbackGasLimit,
    uint32 numWords
  ) external override returns (uint256 requestId){
    requestRandomWordsCalled = true;
    uint256 [] memory randomWords = new uint256[](2);
    randomWords[0] = 4;
    randomWords[1] = 4;
    VRFConsumerBaseV2(msg.sender).rawFulfillRandomWords(uint256(4), randomWords);
    return 4;
  }


  function createSubscription() external override returns (uint64 subId){
    return 1;
  }


  function getSubscription(uint64 subId)
    external override
    view
    returns (
      uint96 balance,
      uint64 reqCount,
      address owner,
      address[] memory consumers
    ){
      return (1, 1, address(0x01BE23585060835E02B77ef475b0Cc51aA1e0709), new address[](1));
    }


  function requestSubscriptionOwnerTransfer(uint64 subId, address newOwner) external override {}


  function acceptSubscriptionOwnerTransfer(uint64 subId) external override {}


  function addConsumer(uint64 subId, address consumer) external override {}


  function removeConsumer(uint64 subId, address consumer) external override {}

  function cancelSubscription(uint64 subId, address to) external override {}
}