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
      'type': type,
      'min': min,
      'max': max
    }
}

/**
 * Parses the output for 'v4l2-ctl -d <device> -L'
 * @param {string} raw the raw output from running the command
 * @returns {Object[]} list of available controls with min and max values
 */
function parseSettings(raw) {
    if(raw === null || raw === undefined) {
        return null;
    }

    let rawLines = raw.split('\n');
    let parsed = rawLines.filter(line => line.match(':')!=null && !line.match('/t') ).map(parseLineHelper)
    let settings = {}

    parsed.forEach(setting => {
        settings[setting.name] = {
            'type': setting.type,
            'min': setting.min,
            'max': setting.max
        }
    })

    let menus = parsed.filter(setting => setting.type == 'menu')
    console.log(menus);

    return settings
}

module.exports = parseSettings;
