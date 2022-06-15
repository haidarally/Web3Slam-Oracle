'use strict';
module.exports = function (app) {
  var api = require('../controllers/Controller');
  app.route('/data').post(api.addData);
  app.route('/getdata').post(api.getData);
  app.route('/getusernft').post(api.getUserNFT);
  //app.route('/getloop').post(api.getLoop);
};
