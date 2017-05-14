const fs = require('fs')

const base = './Apps/data/'

exports.mergeData = (instruments) => {
    
try {
    instruments = instruments || JSON.parse( fs.readFileSync(base + 'instruments.json', {encoding : 'utf8'}) )

    let satellites = JSON.parse( fs.readFileSync(base + 'satellites.json', {encoding : 'utf8'}) )

    satellites.forEach(sat => {
        ins = instruments.find(el => el.id === sat.id)
        if (ins) sat.instruments = ins.instruments
    })

    fs.writeFileSync(base + 'satellitesFULL.json', JSON.stringify(satellites, null, 2) )

    console.log('satellitesFULL.json generated')
}
catch(err) {
    console.log(err)
    throw err
}

}

