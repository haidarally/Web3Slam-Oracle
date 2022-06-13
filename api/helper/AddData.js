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

exports.addUserData = async (wallet, date, data, url) => {
  try {
    const res = await DataContractInstance.methods
      .AddData(wallet, date, data, url)
      .send({
        from: ETHprovider.getAddress(0),
      });
    console.log(res);
    const response = {
      txn_msg: res,
    };
    return response;
  } catch (error) {
    return error;
  }
};
