'use strict';
module.exports = function (app) {
  var api = require('../controllers/Controller');
  app.route('/data').get(api.getData).post(api.addData);
};
