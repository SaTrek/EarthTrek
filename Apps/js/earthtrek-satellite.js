/**
 * @class earthTrekSatellite
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */
require("amd-loader");
var earthTrekSatellite = earthTrekSatellite || {};

define([
    'cesium', '../js/satellite-propagation'
], function(Cesium, propagation) {

    earthTrekSatellite.calculatePosition = function(tleLine1, tleLine2, startTime, date, deltaStep, since) {
        date.setSeconds(date.getSeconds() + deltaStep)
        var newPosition = propagation.getPosition(tleLine1, tleLine2, date);
        var samplePosition = {};
        samplePosition.time = Cesium.JulianDate.addSeconds(startTime, since, new Cesium.JulianDate());
        samplePosition.value = Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, newPosition.height);
        return samplePosition;
    }

    earthTrekSatellite.calculatePositions = function(tleLine1, tleLine2, startTime, duration, intervalCount) {

        var deltaStep = duration / (intervalCount > 0 ? intervalCount : 1);

        var date = new Date();
        var positions = [];
        positions.times = [];
        positions.values = [];
        for (var since = 0; since <= duration; since += deltaStep) {
            var samplePosition = earthTrekSatellite.calculatePosition(tleLine1, tleLine2, startTime, date, deltaStep, since);
            positions.times.push(samplePosition.time);
            positions.values.push(samplePosition.value);
        }
        return positions;
    }

    earthTrekSatellite.addSamples = function(tleLine1, tleLine2, startTime, duration, intervalCount) {
        var samplePositions = earthTrekSatellite.calculatePositions(tleLine1, tleLine2, startTime, duration, intervalCount);
        var property = new Cesium.SampledPositionProperty();
        property.addSamples(
            samplePositions.times,
            samplePositions.times.values
        );
        return property;
    }
});
module.exports = earthTrekSatellite;