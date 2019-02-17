const config = require('../config.json');
const express = require('express');
const logger = require("morgan");
const cors = require("cors");
const bodyParser = require('body-parser');
const createRoute = require('./lib/createControlRoute');

const app = express();

app.use(logger("dev"));
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Routes
const index = require('./routes/index');
app.use('/', index);

const settings = require('./routes/settings');
app.use('/settings', settings);

const brightness = createRoute('brightness', 30, 255);
app.use('/brightness', brightness);

const contrast = createRoute('contrast', 0, 10);
app.use('/contrast', contrast);

const exposure_absolute = createRoute('exposure_absolute', 5, 2000);
app.use('/exposure_absolute', exposure_absolute);

const exposure_auto = createRoute('exposure_auto', 0, 3);
app.use('/exposure_auto', exposure_auto);

const saturation = createRoute('saturation', 0, 200);
app.use('/saturation', saturation);

const sharpness = createRoute('sharpness', 0, 50);
app.use('/sharpness', sharpness);

// error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.message);
});

const listener = app.listen(config.port, function() {
    console.log("Listening on +:" + listener.address().port);
});

module.exports = app;
