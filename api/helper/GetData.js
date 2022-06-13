var dotenv = require('dotenv');
var Web3 = require('web3');
var HDWalletProvider = require('@truffle/hdwallet-provider');
var dataContract = require('./DataContract.json');

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

exports.getUserData = async (userWalletId) => {
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
