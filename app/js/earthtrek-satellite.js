/**
 * @class earthTrekSatellite
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */

var earthTrekSatellite = earthTrekSatellite || {};

define([
    'cesium', '../js/satellite-propagation'
], function(cesiuma, satellitePropagationa) {


    earthTrekSatellite.calculatePosition = function(tleLine1, tleLine2, startTime, date, deltaStep, since) {
        date.setSeconds(date.getSeconds() + deltaStep)
        var newPosition = satellitePropagation.getPosition(tleLine1, tleLine2, date);
        var samplePosition = {};
        samplePosition.time = Cesium.JulianDate.addSeconds(startTime, since, new Cesium.JulianDate());
        samplePosition.value = Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, newPosition.height);
        return samplePosition;
    }

    earthTrekSatellite.calculatePositions = function(tleLine1, tleLine2, startTime, duration, frequency, date) {
        var deltaStep = duration / (frequency > 0 ? frequency : 1);
        var positions = [];
        positions.times = [];
        positions.values = [];
        for (var since = 0; since <= duration; since += deltaStep) {
            var samplePosition = this.calculatePosition(tleLine1, tleLine2, startTime, date, deltaStep, since);
            positions.times.push(samplePosition.time);
            positions.values.push(samplePosition.value);
        }
        return positions;
    }

    earthTrekSatellite.getSamples = function(tleLine1, tleLine2, startTime, duration, frequency) {
        var property = new Cesium.SampledPositionProperty();

        var previousDate = new Date(Cesium.JulianDate.toIso8601(startTime));
        previousDate.setSeconds(previousDate.getSeconds() - duration);
        var previousTimeJulian = Cesium.JulianDate.fromDate(previousDate);
        var previousPositions  = this.calculatePositions(tleLine1, tleLine2, previousTimeJulian, duration, frequency, previousDate);

        property.addSamples(
            previousPositions.times,
            previousPositions.values
        );

        var currentDate = new Date(Cesium.JulianDate.toIso8601(startTime));
        var latestPositions  = this.calculatePositions(tleLine1, tleLine2, startTime, duration, frequency, currentDate);
        property.addSamples(
            latestPositions.times,
            latestPositions.values
        );
        return property;
    }

    earthTrekSatellite.addSamples = function(samplePositions) {
        var property = new Cesium.SampledPositionProperty();
        property.addSamples(
            samplePositions.times,
            samplePositions.values
        );
        return property;
    }
});
