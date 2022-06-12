"use strict";
var GetDataHelper = require("../helper/GetData");
var AddDataHelper = require("../helper/AddData");
var md5 = require("md5");

exports.addData = async function (req, res) {
  const body = req.body;
  let user = body.walletAddress;
  const initDate = body.date;
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
    data
  );

  res.json(resBody);
};

exports.getData = async function (req, res) {
  const body = req.body;
  const user = body.walletAddress;

  let resBody = "";
  if (user === "") {
    resBody = await GetDataHelper.getAllData();
  } else {
    resBody = await GetDataHelper.getUserData(user);
  }

  res.json(resBody);
};
