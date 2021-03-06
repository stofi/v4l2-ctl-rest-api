const execute = require("./execute");
const getCtrlParser = require('./getCtrlParser');
const getSettingsParser = require('./getSettingsParser');
const getDevicesParser = require('./getDevicesParser');

/**
 * Gets the specified control for the device.
 * For example, to get the brightness for /dev/video0, you
 * would call: getControl(0, 'brightness').
 * @param {number} deviceId the device number of the camera
 * @param {string} control the control name
 */
function getControl(deviceId, control) {
    return new Promise((resolve, reject) => {
        execute(`v4l2-ctl -d /dev/video${deviceId} --get-ctrl ${control}`)
            .then(output => {
                if(output.stderr) {
                    return reject(data.stderr);
                }

                return resolve(getCtrlParser(output.stdout));
            })
            .catch(error => reject(error));
    });
}

/**
 * Sets the specified control value for the device.
 * For example, to set the brightness for /dev/video0
 * to 140, you would call: setControl(0, 'brightness', 140).
 * @param {number} deviceId the device number of the camera
 * @param {string} control the control name
 * @param {number} value the desired value
 * @return the new setting for the device
 */
function setControl(deviceId, control, value) {
    return new Promise((resolve, reject) => {
        return execute(`v4l2-ctl -d /dev/video${deviceId} --set-ctrl=${control}=${value}`)
            .then(output => {
                if(output.stderr) {
                    return reject(data.stderr);
                }

                return resolve({
                    setting: control,
                    value: value
                });
            })
            .catch(error => reject(error));
    });
}

/**
 * Get a list of settings available for the selected device.
 * @param {number} deviceId the device number of the camera
 * @returns array of avaible settings with min and max values
 */
function getSettings(deviceId) {
    return new Promise((resolve, reject) => {
        return execute(`v4l2-ctl -d /dev/video${deviceId} -l`)
            .then(output => {
                if(output.stderr) {
                    return reject(data.stderr);
                }

                return resolve(getSettingsParser(output.stdout));
            })
            .catch(error => reject(error));
    });
}

/**
 * Get a list of available devices
 * @returns array of avaible device ids
 */
function getDevices() {
    return new Promise((resolve, reject) => {
        return execute(`v4l2-ctl --list-devices`)
            .then(output => {
                if(output.stderr) {
                    return reject(data.stderr);
                }

                return resolve(getDevicesParser(output.stdout));
            })
            .catch(error => reject(error));
    });
}

module.exports.getControl = getControl;
module.exports.setControl = setControl;
module.exports.getSettings = getSettings;
module.exports.getDevices = getDevices;
