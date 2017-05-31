/**
 * @class earthTrekSatellite
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */

var earthTrekSatellite = earthTrekSatellite || {};

define([
    'cesium', 'satellite-propagation'
], function() {


    earthTrekSatellite.calculatePosition = function(tleLine1, tleLine2, startTime, date, deltaStep, since) {
        date.setSeconds(date.getSeconds() + deltaStep)
        var propagate = satellitePropagation.getPositionAndVelocity(tleLine1, tleLine2, date);
        var newPosition = propagate.position;
        var samplePosition = {};
        samplePosition.time = Cesium.JulianDate.addSeconds(startTime, since, new Cesium.JulianDate());
        samplePosition.position = Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, newPosition.height);
        samplePosition.height = newPosition.height;
        samplePosition.velocity = propagate.velocity;
        return samplePosition;
    }

    earthTrekSatellite.calculatePositions = function(tleLine1, tleLine2, startTime, duration, frequency, date) {
        var deltaStep = duration / (frequency > 0 ? frequency : 1);
        var positions = [];
        positions.times = [];
        positions.positions = [];
        positions.heights = [];
        positions.velocities = [];
        for (var since = 0; since <= duration; since += deltaStep) {
            var samplePosition = this.calculatePosition(tleLine1, tleLine2, startTime, date, deltaStep, since);
            positions.times.push(samplePosition.time);
            positions.positions.push(samplePosition.position);
            positions.heights.push(samplePosition.height);
            positions.velocities.push(samplePosition.velocity);
        }
        return positions;
    }

    earthTrekSatellite.getSamples = function(tleLine1, tleLine2, startTime, duration, frequency) {

        var previousDate = new Date(Cesium.JulianDate.toIso8601(startTime));
        previousDate.setSeconds(previousDate.getSeconds() - duration);
        var previousTimeJulian = Cesium.JulianDate.fromDate(previousDate);
        var previousPositions  = this.calculatePositions(tleLine1, tleLine2, previousTimeJulian, duration, frequency, previousDate);

        var positions = new Cesium.SampledPositionProperty();
        positions.addSamples(
            previousPositions.times,
            previousPositions.positions
        );

        var heights = new Cesium.SampledProperty(Number);
        heights.addSamples(
            previousPositions.times,
            previousPositions.heights
        );

        var velocities = new Cesium.SampledPositionProperty();
        velocities.addSamples(
            previousPositions.times,
            previousPositions.velocities
        );

        var currentDate = new Date(Cesium.JulianDate.toIso8601(startTime));
        var latestPositions  = this.calculatePositions(tleLine1, tleLine2, startTime, duration, frequency, currentDate);
        positions.addSamples(
            latestPositions.times,
            latestPositions.positions
        );
        heights.addSamples(
            latestPositions.times,
            latestPositions.heights
        );

        velocities.addSamples(
            latestPositions.times,
            latestPositions.velocities
        );
        return {positions: positions, heights: heights, velocities: velocities};
    }

    earthTrekSatellite.addSamples = function(times, values) {
        var property = new Cesium.SampledPositionProperty();
        property.addSamples(times, values);
        return property;
    }
});
