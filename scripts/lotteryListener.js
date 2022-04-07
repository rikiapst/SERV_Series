const MNEMONIC = process.env.MNEMONIC;
const ethers = require('ethers');

const alchemyProvider = new ethers.providers.WebSocketProvider('wss://eth-rinkeby.alchemyapi.io/v2/7wWUF2gIYOCCSYjdWTCHZCSYE6MtpXVe');

const wallet = ethers.Wallet.fromMnemonic(MNEMONIC);
const account = wallet.connect(alchemyProvider);

const addresses = {
  WETH: '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  nftContract: '0x0c1c5dad2F16754bD84043E141987b2c7225A52F',//contract address
  lotteryAccount: '0x1a9Cf6FdEAB2937Fc4f204819e3e963dd197715a'
}

async function set_allowance_ether(account, token, amount, addresses) {
  const etherAmount = ethers.utils.parseUnits(`${amount}`, 'ether');
  const weth = new ethers.Contract(
    token,
    ['function approve(address _spender, uint256 _value) public returns (bool success)',
      'function allowance(address owner, address spender) external view returns (uint)'],
    account
  );
  const tx = await weth.approve(addresses.nftContract, etherAmount);
  const receipt = await tx.wait();
  console.log(`approval receipt ${receipt}`)
  const amountApproved = await weth.allowance(addresses.lotteryAccount, addresses.nftContract);
  console.log(`amount approved ${amountApproved.toString()}`);
  return amountApproved;
}

// need to find best way to set max allowance
set_allowance_ether(account, addresses.WETH, 10000000000000000000, addresses);