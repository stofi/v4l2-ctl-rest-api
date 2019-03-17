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
            .then(settings => {
                let settingKeys = Object.keys(settings)
                let promises = settingKeys.map(
                    setting => v4l2ctl.getControl(deviceId, setting)
                )
                return Promise.all(promises)
            })
            .then(devSettings => res.json(
                devSettings.map(i => ({
                    [i.setting]: i.value
                }))
            ))
            .catch(error => res.status(500).json(error));
    });

    router.get("/:deviceId/settings", function(req, res) {
        let deviceId = req.params.deviceId;

        v4l2ctl.getSettings(deviceId)
            .then(devSettings => res.json(devSettings))
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
            .then(devSettings => normalizeValue(value, devSettings[setting].min, devSettings[setting].max))
            .then(normalValue => v4l2ctl.setControl(deviceId, setting, normalValue))
            .then(control => res.json(control))
            .catch(error => res.status(500).json(error));

    });

    router.get("/:deviceId/:setting/min_value", function(req, res) {
        let deviceId = req.params.deviceId;
        let setting = req.params.setting;

        v4l2ctl.getSettings(deviceId)
            .then(devSettings => res.json({ min: devSettings[setting].min }))
            .catch(error => res.status(500).json(error));
    });

    router.get("/:deviceId/:setting/max_value", function(req, res) {
        let deviceId = req.params.deviceId;
        let setting = req.params.setting;

        v4l2ctl.getSettings(deviceId)
            .then(devSettings => res.json({ max: devSettings[setting].max }))
            .catch(error => res.status(500).json(error));
    });

    return router
}

module.exports = generateRoutes;
