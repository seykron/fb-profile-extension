#!/usr/bin/node
var express = require('express');
var app = express();

// General configuration.
app.configure(function(){
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(app.router);
  app.use("/asset", express.static(__dirname + "/views/asset"));
});

require("./routes")(app);

app.listen(3000);
