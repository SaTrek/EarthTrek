/**
 * Created by AlexSnipes on 5/11/17.
 */
/**
 * SSCWeb parser
 * Observatories give us the satellite names and their StartTime and EndTime
 * @type {request}
 */
var request = require("request"),
    async = require('async');


var SscWeb = SscWeb || {};

var url = 'https://sscweb.sci.gsfc.nasa.gov/WS/sscr/2/observatories';
var options = {
    uri: url,
    headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
    },
    json: true
};

/**
 * @param array SatellitesIds satsId
 * @param cb
 */
SscWeb.getObservatories = function(satsId, cb) {
    async.waterfall([
        function(callback) {
            var observatories = []
            request(options, function (error, response, body) {
                body.Observatory[1].forEach(function (element) {
                    if (satsId.indexOf(element.Id) > 0) {
                        observatories.push(element.Name);
                    }
                });

                if (error) {
                    return callback(error);
                }
                callback(null, observatories);
            });
        }
    ], cb)
}


module.exports = SscWeb;