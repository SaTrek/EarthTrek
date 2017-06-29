'use strict';

/**
 * @class EarthTrekData
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */
var earthTrekData = earthTrekData || {};
var rp = require('request-promise');

'use strict';
var _ = require('underscore');
var satelliteIds = [];
/**
 * Get Satellites Ids
 */
earthTrekData.getSatelliteIds = function () {
    if (satelliteIds != null) {
        return satelliteIds;
    }
    earthTrekData.getSatellites().then(function (satellites) {
        var satIds = [];
        satellites.data.forEach(function (satellite) {
            satIds.push(satellite.satId);
        });
        satelliteIds = satIds;
        return satIds;
    });
};

/**
 *
 */
earthTrekData.getSatellites = function () {
    var config = earthTrekData.getConfig();
    var options = {
        uri: config.api.url + config.api.satellites.endpoint,
        json: true
    };
    return rp(options);
};

/**
 * Get TLE from Satellites IDs
 * @param ids
 * @param options
 * @returns {*}
 */
earthTrekData.getTLEs = function (ids, options) {
    var config = earthTrekData.getConfig();
    var qs = {};
    qs.ids = ids.join(',');
    if (options.startDate) {
        var startDate = options.startDate;

        if (!(startDate instanceof Date)) {
            startDate = new Date(startDate);
            startDate.setDate(startDate.getDate());
        }

        if (startDate instanceof Date) {
            startDate = startDate.getUTCFullYear() + '-' + (startDate.getUTCMonth() + 1) + '-' + startDate.getUTCDate();
        }
        qs.startDate = startDate;
        if (options.endDate) {
            var _endDate = options.endDate;
            if (_endDate instanceof Date) {
                _endDate = _endDate.getUTCFullYear() + '-' + (_endDate.getUTCMonth() + 1) + '-' + _endDate.getUTCDate();
            }
        }
        qs.endDate = endDate;
    }
    var fields = !options.fields ? config.api.tle.fields : options.fields;
    qs.fields = fields;
    qs.extended = true;
    return rp({
        uri: config.api.url + config.api.tle.endpoint,
        qs: qs,
        json: true
    });
};

/**
 *
 */
earthTrekData.getConfig = function () {
    return {
        api: {
            url: 'http://api.orbitaldesign.tk/',
            satellites: {
                endpoint: "satellites"
            },
            tle: {
                endpoint: "tles",
                fields: "tle,satId"
            }
        }
    };
};

/**
 *
 */
earthTrekData.getFullData = function (options, callback) {
    if (!options.getCache) {
        options.getCache = false;
    }
    if (options.getCache == true) {
        return earthTrekData.getCache().then(function (data) {
            return callback(data);
        });
    }
    var promise = earthTrekData.getSatellites();
    var tlePromise = promise.then(function (satellites) {
        var satIds = [];
        satellites.data.forEach(function (satellite) {
            satIds.push(satellite.satId);
        });
        satelliteIds = satIds;
        return earthTrekData.getTLEs(satIds, options);
    });
    Promise.all([promise, tlePromise]).then(function (tles) {
        /**
         * @TODO -TEMPORAL
         */
        var finalJson = [];
        tles[0].data.forEach(function (satellite) {
            if (satellite.color == undefined) {
                satellite.color = '#8FBC8F';
            }
            tles[1].data.forEach(function (satTle) {
                if (satellite.satId == satTle.satId) {
                    satellite.data = _.extend({
                        'mass': satellite.mass,
                        'agency': satellite.agency,
                        'program': satellite.program,
                        'launchDate': satellite.launchDate
                    }, satTle.data);
                    var dataMerge = _.extend(satTle, satellite);
                    finalJson.push(dataMerge);
                }
            });
        });
        callback(finalJson);
    });
};

/**
 *
 * @returns {*}
 */
earthTrekData.getCache = function () {
    /* var options = {
         uri: 'data/satellites.json',
         json: true
     };
     return rp(options);*/
    return $.ajax('data/satellites.json');
};

/**
 *
 */
earthTrekData.getFeatures = function () {
    var config = earthTrekData.getConfig();
    return $.ajax('data/features.json');
};
module.exports = earthTrekData;