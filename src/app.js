const config = require('../config.json');
const express = require('express');
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const generateRoutes = require('./lib/generateRoutes');


const app = express();
const routes = generateRoutes();

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
app.use('/', routes);

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
});

const listener = app.listen(config.port, function() {
    console.log("Listening on +:" + listener.address().port);
});

module.exports = app;
