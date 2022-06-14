var dotenv = require('dotenv');
var Web3 = require('web3');
var HDWalletProvider = require('@truffle/hdwallet-provider');
var dataContract = require('./DataContract.json');
var collectionContract = require('./CollectionContract.json');
const md5 = require('md5');

const MNEMONICS = `also alcohol metal point whip emerge science elevator recycle can bundle diesel`;

const ETHprovider = new HDWalletProvider({
  mnemonic: MNEMONICS,
  providerOrUrl:
    'https://rinkeby.infura.io/v3/679e629368664df78fb2bdb6826271b7',
  addressIndex: 0,
});

const web3ETH = new Web3(ETHprovider);

const DataContractInstance = new web3ETH.eth.Contract(
  dataContract.abi,
  '0x5D58d9CDb834bA9C92B533657C1Bd97C8162788d'
);

const CollectionInstance = new web3ETH.eth.Contract(
  collectionContract.abi,
  '0x2d8eF71FB1DDb98f9f713F5FFC6b838D293cbe4d'
);

exports.getUserData = async (userWalletId) => {
  try {
    console.log(`Getting User Data for ${userWalletId}`);
    userWalletId = md5(userWalletId);
    const res = await DataContractInstance.methods.GetData(userWalletId).call();
    console.log(res);
    //console.log(ETHprovider.getAddress(0));
    const user = {
      user: res,
    };
    return user;
  } catch (error) {
    return error;
  }
};

exports.getHashedData = async (userWalletId) => {
  console.log(`Getting Hashed Data for ${userWalletId}`);
  try {
    const res = await DataContractInstance.methods.GetData(userWalletId).call();
    console.log(res);
    //console.log(ETHprovider.getAddress(0));
    const user = {
      user: res,
    };
    return user;
  } catch (error) {
    return error;
  }
};

exports.getAllData = async () => {
  try {
    const arrayLength = await DataContractInstance.methods.arrayLength().call();
    //console.log(arrayLength);
    let userArray = new Array();
    for (let i = 0; i < arrayLength; i++) {
      const currentUser = await DataContractInstance.methods.userList(i).call();
      //console.log(currentUser);
      userArray.push(currentUser);
    }

    let allData = new Array();

    const userLength = userArray.length;
    for (let i = 0; i < userLength; i++) {
      const userdata = await DataContractInstance.methods
        .GetData(userArray[i])
        .call();
      allData.push({ user: userArray[i], data: { userdata } });
    }

    return allData;
  } catch (error) {
    return error;
  }
};

exports.getUserNFTs = async (walletAddress) => {
  let arrayLength = 48; //TODO: remove hardcoding
  let balanceArray = new Array();
  for (let i = 0; i < arrayLength; i++) {
    let hasNFT = false;
    const balance = await CollectionInstance.methods
      .balanceOf(walletAddress, i)
      .call();

    const metadata = await CollectionInstance.methods.uri(i).call();
    console.log(metadata);

    if (balance > 0) {
      hasNFT = true;
    }

    balanceArray.push({
      id: i,
      balance: balance,
      hasNFT: hasNFT,
      metadata: metadata,
    });
  }

  return balanceArray;
};
