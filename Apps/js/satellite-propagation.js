/**
 * @class Satellite Propagation
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */
require("amd-loader");

var satellitePropagation = satellitePropagation || {};

define([
    'satellite.js'
], function(satellite) {
    var satellite = satellite.satellite;

    /**
     * Propagate Satellite
     * @param string tleLine1
     * @param string tleLine2
     * @param Date date
     * @returns {*}
     */
    satellitePropagation.propagate = function(tleLine1, tleLine2, date) {
        var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
        var positionAndVelocity = satellite.propagate(satrec, date);
        return positionAndVelocity;
    }

    /**
     * Get Velocity in KM
     * @param string tleLine1
     * @param stringtleLine2
     * @param Date date
     * @returns {number}
     */
    satellitePropagation.getVelocity = function(tleLine1, tleLine2, date) {
        var positionAndVelocity = this.propagate(tleLine1, tleLine2, date);
        var velocityEci = positionAndVelocity.velocity;
        var vel = Math.sqrt(Math.pow(velocityEci.x, 2) + Math.pow(velocityEci.y, 2) + Math.pow(velocityEci.z, 2));
        return vel;
    }

    /**
     * Get Position Degree Coordinates (longitude, latitude, height)
     * @param string tleLine1
     * @param string tleLine2
     * @param Date date
     * @returns {*}
     */
    satellitePropagation.getPosition = function(tleLine1, tleLine2, date) {
        var positionAndVelocity = this.propagate(tleLine1, tleLine2, date);
        var positionEci = positionAndVelocity.position;

        var gmst = satellite.gstimeFromDate(
            date.getUTCFullYear(),
            date.getUTCMonth() + 1,
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        );

        var positionGd  = satellite.eciToGeodetic(positionEci, gmst);
        var longitude = positionGd.longitude,
            latitude  = positionGd.latitude,
            height    = positionGd.height;

        var longitudeStr = satellite.degreesLong(longitude),
            latitudeStr  = satellite.degreesLat(latitude);

        positionGd.longitude = longitudeStr;
        positionGd.latitude = latitudeStr;
        positionGd.height = positionGd.height * 1000;
        return positionGd;
    }

});
module.exports = satellitePropagation;