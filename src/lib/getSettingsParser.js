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
    let parsed = rawLines.filter(line => line.match(':')!=null && !line.match('\t') ).map(parseLineHelper)
    let settings = {}

    parsed.forEach(setting => {
        settings[setting.name] = {
            'type': setting.type,
            'min': setting.min,
            'max': setting.max
        }
    })

    let menus = parsed.filter(setting => setting.type == 'menu').map(setting => setting.name)

    menus.forEach(menu => {
        let foundMenu = false
        let foundValues = false
        let values = rawLines
            .filter( line => {
                if (!foundMenu) {
                    let isMenu = line.match(menu)
                    foundMenu = !!isMenu
                    return false
                } else if(!foundValues){
                    let isValue = line.match(/^\t/)
                    foundValues = !isValue
                    return isValue
                }
                return false
            })
            .map( value => value.replace(/\t/g,'') )
            .map( value => {
                let split = value.split(':')
                let id = Number(split[0])
                let label = split[1].replace(/^ /,'')
                return {
                  id, label
                }
            })

        settings[menu].values = values
    })


    return settings
}

module.exports = parseSettings;
