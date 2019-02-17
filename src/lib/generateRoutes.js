const express = require("express");
const router = express.Router();

const v4l2ctl = require('./v4l2ctl');
const normalizeValue = require('./normalizeValue');

/**
 * Creates a router for a specified control.
 * @return {Object} an express router with setting paths for the control.
 */
function generateRoutes() {

  router.get('/', function(req, res) {
      return res.sendStatus(200);
  });

  router.get('/devices', function(req, res) {

      v4l2ctl.getDevices()
          .then(devices => res.json(devices))
          .catch(error => res.status(500).json(error));
  });

  router.get("/:deviceId", function(req, res) {
      let deviceId = req.params.deviceId;

      v4l2ctl.getSettings(deviceId)
          .then(setting => res.json(setting))
          .catch(error => res.status(500).json(error));
  });

  router.get("/:deviceId/:setting", function(req, res) {
      let deviceId = req.params.deviceId;
      let setting = req.params.setting;

      v4l2ctl.getControl(deviceId, setting)
          .then(control => res.json(control))
          .catch(error => res.status(500).json(error));
  });

  router.get("/:deviceId/:setting/:value", function(req, res) {
      let deviceId = req.params.deviceId;
      let setting = req.params.setting;
      let value = parseInt(req.params.value);

      v4l2ctl.getSettings(deviceId)
          .then(deviceSetting => normalizeValue(value, deviceSetting.min, deviceSetting.max))
          .then(normalValue => v4l2ctl.setControl(deviceId, setting, normalValue))
          .then(control => res.json(control))
          .catch(error => res.status(500).json(error));

  });

  return router
}

module.exports = generateRoutes;
