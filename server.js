var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;
bodyParser = require('body-parser');
var cors = require('cors');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
  cors({
    credentials: true,
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: true,
  })
);

var routes = require('./api/routes/Routes'); //importing route
routes(app); //register the route

app.listen(port);

console.log(`The Oracle has started in Port : {${port}}`);
