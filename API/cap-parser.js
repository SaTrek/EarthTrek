var sats2 = ["aqua", "aura", "calipso", "cloudsat", "dscovr", 'iss', "jason2", "kepler", "suomi", "terra", "trmm", "landsat", "grace", "icesat", "sorce", "calipso", "quikscat", "smap", "gpm", "sac-d"]

var parser = new ol.format.WMTSCapabilities();

fetch('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml')
    .then(function(response) {
        return response.text()
    })
    .then(function(text) {
        var data = parser.read(text),
            sats = [],
            satellite, instrument, sat, ins, layer, _temp

        data.Contents.Layer.forEach(function(l){
            _temp = l.Title.split('(')[1].split(',')
            
            sat = _temp.pop()
            sat = sat && sat.slice(0,-1).trim()
            satellite = getSat(sats, sat)
            if (!satellite) {
                satellite = { id: sat, instruments: [] }
                sats.push(satellite)
            }
            
            ins = _temp.pop()
            ins = ins && ins.trim()
            instrument = getIns(satellite, ins)
            if (!instrument) {
                instrument = { name: ins, layers: [] }
                satellite.instruments.push(instrument)
            }

            _temp = l.Dimension && l.Dimension[0].Value[0].split('/')
            
            layer = {
                id : l.Identifier,
                title : l.Title,
                format : l.Format[0],
                resolution : l.TileMatrixSetLink[0].TileMatrixSet,
                startDate : _temp && _temp.length && _temp[0],
                endDate : _temp && _temp.length && _temp[1],
            }

            instrument.layers.push(layer)

        })

        document.querySelector('.test').value = JSON.stringify(sats, null, 2)

        
    })

function getSat(sats, sat) {
    return sats.find(function(el){return el.id === sat})
}

function getIns(sat, ins) {
    return sat.instruments.find(function(el){return el.name === ins})
}
