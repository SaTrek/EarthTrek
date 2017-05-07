/**
 * SSCWeb parser
 * Observatories give us the satellite names and their StartTime and EndTime
 * @type {request}
 */
var request = require("request");
var url = 'https://sscweb.sci.gsfc.nasa.gov/WS/sscr/2/observatories';
var options = {
    uri: url,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    json: true
};
var satsId = ["aqua", "aura", "calipso", "cloudsat", "dscovr", 'iss', "jason2", "kepler", "suomi", "terra", "trmm", "landsat", "grace1", "grace2", "icesat", "sorce", "quikscat", "smap", "gpm", "sac-d", "trace", "spitzer", "GCOM-W1", "oco2"]

request(options, function(error, response, body){
    if(error) console.log(error);
    else {
        body.Observatory[1].forEach(function(element){
            if (satsId.indexOf(element.Id) > 0) {
                console.log(element.Name);
            }
        });
    }
});