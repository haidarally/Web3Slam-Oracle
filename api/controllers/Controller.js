'use strict';
var GetDataHelper = require('../helper/GetData');
var AddDataHelper = require('../helper/AddData');
var md5 = require('md5');
var { calculateLimitAndOffset, paginate } = require('paginate-info');

exports.addData = async function (req, res) {
  const body = req.body;
  let user = body.walletAddress;
  const url = body.url;
  const data = body.data;

  // Hashing user wallet
  user = md5(user);

  //Formating date
  let date = new Date().getTime();
  let birthDateInUnixTimestamp = date / 1000;
  birthDateInUnixTimestamp = ~~birthDateInUnixTimestamp;

  let resBody = await AddDataHelper.addUserData(
    user,
    BigInt(birthDateInUnixTimestamp),
    data,
    url
  );

  res.json(resBody);
};

exports.getData = async function (req, res) {
  const body = req.body;
  const user = body.walletAddress;
  const currentPage = body.currentPage;
  const pageSize = body.pageSize;

  let resBody = '';
  if (user === '' && currentPage != null && pageSize != null) {
    var data = await GetDataHelper.getAllData();
    const { limit, offset } = calculateLimitAndOffset(currentPage, pageSize);
    const count = data.length;
    const paginatedData = data.slice(offset, offset + limit);
    const paginationInfo = paginate(currentPage, count, paginatedData);

    resBody = {
      result: paginatedData,
      meta: paginationInfo,
    };
  } else {
    resBody = await GetDataHelper.getUserData(user);
  }

  res.json(resBody);
};
