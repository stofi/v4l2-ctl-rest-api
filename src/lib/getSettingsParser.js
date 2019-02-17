function parseLineHelper(rawLine) {
    let name = ''
    let type = 'int'
    let min  = 0
    let max  = 1

    let lineSplit = rawLine.split(':')

    name = lineSplit[0].match(/(\w+)/)[1]
    type = lineSplit[0].match(/\((\w+)\)/)[1]

    if (type!=='bool'){
      min = parseInt(lineSplit[1].match(/min=(\S+)/)[1])
      max = parseInt(lineSplit[1].match(/max=(\S+)/)[1])
    }

    return {
      'name': name,
      'min': min,
      'max': max
    }
}

/**
 * Parses the output for 'v4l2-ctl -d <device> -l'
 * @param {string} raw the raw output from running the command
 * @returns {Object[]} list of available controls with min and max values
 */
function parseSettings(raw) {
    if(raw === null || raw === undefined) {
        return null;
    }

    var parsed = [];
    var splitRaw = raw.split('\n');
    for(var split of splitRaw) {
        parsed.push(parseLineHelper(split));
    }

    return parsed
}

module.exports = parseSettings;
