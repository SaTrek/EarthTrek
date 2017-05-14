var parser = new ol.format.WMTSCapabilities();

say('Getting capabilities xml...')
fetch('https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/1.0.0/WMTSCapabilities.xml')
    .then(function(response) {
        say('Converting to json...')
        return response.text()
    })
    .then(function(text) {
        say('Parsing instruments data...')
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
                title : l.Title
                    .replace(ins + ', ' + sat, '')
                    .replace(', )',')')
                    .replace(' ()', ''),
                format : l.Format[0],
                resolution : l.TileMatrixSetLink[0].TileMatrixSet,
                startDate : _temp && _temp.length && _temp[0],
                endDate : _temp && _temp.length && _temp[1],
            }

            instrument.layers.push(layer)

        })

        json = JSON.stringify(sats, null, 2)

        $('#json').val(json)

        say('Sending instruments data for merging...')
        $.ajax({
            type: "POST",
            url: location.origin + '/api/merge',
            data: json,
            success: function(data, status){
                say('Data merged!')
            },
            error: function(err){
                say(err)
            },
        })
        
    })

function getSat(sats, sat) {
    return sats.find(function(el){return el.id === sat})
}

function getIns(sat, ins) {
    return sat.instruments.find(function(el){return el.name === ins})
}

function say(msg) {
    if ($('#msg').html()) $('#msg').append(' done<br/>')
    $('#msg').append(msg)
}