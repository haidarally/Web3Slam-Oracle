'use strict';
module.exports = function (app) {
  var api = require('../controllers/Controller');
  const apicache = require('apicache-plus');
  app.route('/data').get(apicache('5 minutes'), api.getData).post(api.addData);
};
