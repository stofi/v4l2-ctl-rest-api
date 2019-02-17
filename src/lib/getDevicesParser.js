/**
 * Parses the output for 'v4l2-ctl --list-devices'
 * @param {string} raw the raw output from running the command
 * @returns {number[]} list of available device ids
 */
function parseSettings(raw) {
    if(raw === null || raw === undefined) {
        return null;
    }

    let rawDevices = raw.match(/\/dev\/video\d+/g)
    let devices = rawDevices.forEach(d=>parseInt(d.replace('/dev/video','')))

    return devices
}

module.exports = parseSettings;
