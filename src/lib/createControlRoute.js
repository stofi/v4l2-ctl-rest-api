const express = require("express");
const router = express.Router();

const v4l2ctl = require('./v4l2ctl');
const normalizeValue = require('./normalizeValue');

/**
 * Creates a router for a specified control.
 * @param {string} control the control name
 * @param {number} min the min value
 * @param {number} max the max value
 * @return an express router with setting paths for the control. 
 */
function createRoute(control, min, max) {

  const SETTING = control;
  const MIN_VALUE = min;
  const MAX_VALUE = max;

  router.get("/min_value", function(req, res) {
      res.json({ min: MIN_VALUE });
  });

  router.get("/max_value", function(req, res) {
      res.json({ max: MAX_VALUE });
  });

  router.post("/:deviceId/:value", function(req, res) {
      let deviceId = req.params.deviceId;
      let value = parseInt(req.params.value);

      v4l2ctl.setControl(deviceId, SETTING, normalizeValue(value, MIN_VALUE, MAX_VALUE))
          .then(control => res.json(control))
          .catch(error => res.status(500).json(error));
  });

  router.get("/:deviceId", function(req, res) {
      let deviceId = req.params.deviceId;

      v4l2ctl.getControl(deviceId, SETTING)
          .then(control => res.json(control))
          .catch(error => res.status(500).json(error));
  });

  return router
}

module.exports = createRoute;
