/**
 * @class EarthTrekData
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */


var earthTrekData = earthTrekData || {};
define([
    'earthtrek-satellite'
], function (earthTrekSatellitez) {
    'use strict';

    /**
     *
     */
    earthTrekData.getSatellites = function () {
        $.getJSON("http://localhost:9081/satellites", function (satellites) {
            var satIds = [];
            satellites.data.forEach(function (satellite) {
                satIds.push(satellite.satId);
            })
            return satIds;
        });
    }
    /**
     *
     */
    earthTrekData.getTLEs = function (ids, options) {
        var params = [];
        params.push('ids=' + ids.join(','));
        if (options.startDate) {
            params.push('startDate=' + options.startDate);
            if (options.endDate) {
                params.push('endDate=' + options.endDate);
            }
        }
        $.getJSON("http://localhost:9081/tles?" + params.join('&'), function (satellites) {
            satellites.data.forEach(function (satellite) {
                console.log(satellite)
            })
        });
    }
  //  module.exports = EarthTrekData;
});