/**
 * @class EarthTrekData
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */


var earthTrekData = earthTrekData || {};
define([
    'underscore',
    'earthtrek-satellite'
], function (_, earthTrekSatellitez) {
    'use strict';

    var satelliteIds = [];

    /**
     *
     */
    earthTrekData.getSatelliteIds = function () {
        if (satelliteIds != null) {
            return satelliteIds;
        }
        earthTrekData.getSatellites().then(function(satellites) {
            var satIds = [];
            satellites.data.forEach(function (satellite) {
                satIds.push(satellite.satId);
            })
            satelliteIds = satIds;
            return satIds;
        });
    }
    /**
     *
     */
    earthTrekData.getSatellites = function () {
        return $.ajax("http://api.orbitaldesign.tk/satellites");
    }

    /**
     *
     */
    earthTrekData.getTLEs = function (ids, options) {
        var params = [];
        params.push('ids=' + ids.join(','));
        if (options.startDate) {
            var startDate = options.startDate;

            if (!(startDate instanceof Date)) {
                var startDate = new Date(startDate);
                startDate.setDate(startDate.getDate() - 1);
            }

            if (startDate instanceof Date) {
                startDate = startDate.getUTCFullYear() + '-' + (startDate.getUTCMonth() + 1) + '-' +  startDate.getUTCDate();
            }
            params.push('startDate=' + startDate);
            if (options.endDate) {
                var endDate = options.endDate;
                if (endDate instanceof Date) {
                    endDate = endDate.getUTCFullYear() + '-' + (endDate.getUTCMonth() + 1) + '-' +  endDate.getUTCDate();
                }
                params.push('endDate=' + endDate);
            }
        }
        return $.ajax("http://api.orbitaldesign.tk/tles?" + params.join('&'));
    }

    /**
     *
     */
    earthTrekData.getFullData = function (options, callback) {
        var promise = earthTrekData.getSatellites();

        var tlePromise = promise.then(function(satellites) {
            var satIds = [];
            satellites.data.forEach(function (satellite) {
                satIds.push(satellite.satId);
            })
            satelliteIds = satIds;
            return earthTrekData.getTLEs(satIds, options);
        });
        Promise.all([promise, tlePromise]).then(function(tles) {
            /**
             * @TODO -TEMPORAL
             */
            var finalJson = [];
            tles[0].data.forEach(function (satellite) {
                tles[1].data.forEach(function(satTle) {
                    if (satellite.satId == satTle.satId) {
                        finalJson.push(_.extend(satTle, satellite));
                    }
                });
            });
            callback(finalJson);
        });
    }
});