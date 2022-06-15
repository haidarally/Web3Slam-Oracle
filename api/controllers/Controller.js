'use strict';
var GetDataHelper = require('../helper/GetData');
var AddDataHelper = require('../helper/AddData');
var md5 = require('md5');
const { stringify } = require('flatted');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 100, checkperiod: 300 });
const myCacheNFT = new NodeCache({ stdTTL: 100, checkperiod: 3000 });

var { calculateLimitAndOffset, paginate } = require('paginate-info');

exports.addData = async function (req, res) {
  const body = req.body;
  let user = body.walletAddress;
  const url = body.url;
  const data = body.data;
  let resBody = {};

  console.log(`Adding Date: ${stringify(req)}`);

  // Hashing user wallet
  try {
    if (user != null && user != undefined && user != '') {
      user = md5(user);
      console.log(`user:${user}`);
      //Formating date
      let date = new Date().getTime();
      let birthDateInUnixTimestamp = date / 1000;
      birthDateInUnixTimestamp = ~~birthDateInUnixTimestamp;

      resBody = await AddDataHelper.addUserData(
        user,
        BigInt(birthDateInUnixTimestamp),
        data,
        url
      );
    } else {
      resBody = {
        result: `User undefined`,
      };
    }
  } catch (error) {
    resBody = { error };
  }

  res.json(resBody);
};

exports.getData = async function (req, res) {
  const body = req.body;
  const user = body.walletAddress;
  const currentPage = body.currentPage;
  const pageSize = body.pageSize;
  const isHashed = body.isHashed;

  console.log(`ishashed: ${isHashed}`);
  let resBody = '';
  //caching
  var key = md5(stringify(req.body));
  console.log(`Key: ${key}`);
  try {
    if (myCache.has(key)) {
      resBody = myCache.get(key);
    } else {
      try {
        if (user === '' && currentPage != null && pageSize != null) {
          var data = await GetDataHelper.getAllData();
          const { limit, offset } = calculateLimitAndOffset(
            currentPage,
            pageSize
          );
          const count = data.length;
          const paginatedData = data.slice(offset, offset + limit);
          const paginationInfo = paginate(currentPage, count, paginatedData);

          resBody = {
            result: paginatedData,
            meta: paginationInfo,
          };
          myCache.set(key, resBody);
        } else if (isHashed) {
          resBody = await GetDataHelper.getHashedData(user);
          myCache.set(key, resBody);
        } else {
          resBody = await GetDataHelper.getUserData(user);
          myCache.set(key, resBody);
        }
      } catch (error) {
        resBody = { error };
      }
    }
  } catch (error) {
    resBody = { error };
  }

  res.json(resBody);
};

exports.getUserNFT = async function (req, res) {
  const walletAddress = req.body.walletAddress;
  var key = md5(stringify(req.body));
  console.log(`Key: ${key}`);

  let resBody = '';

  if (myCacheNFT.has(key)) {
    resBody = myCacheNFT.get(key);
  } else {
    try {
      resBody = await GetDataHelper.getUserNFTs(walletAddress);
      myCacheNFT.set(key, resBody);
    } catch (error) {
      resBody = { error: stringify(error) };
    }
  }

  res.json(resBody);
};

exports.getLoop = async function (req, res) {
  async function sleep(msec) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }
  async function testSleep() {
    console.log('Waiting for 100 second...');
    await sleep(1000 * 100);
    console.log('Waiting done.'); // Called 1 second after the first console.log
  }
  let resBody = '';
  let i = 1;
  if ((req.body.value = 1)) {
    try {
      while (i > 0) {
        await testSleep();
        i++;
      }
      resBody = 'never getting here';
    } catch (error) {}
  }
  res.json(resBody);
};
