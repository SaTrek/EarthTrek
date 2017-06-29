'use strict';

/**
 * @class EarthTrekEntity
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 2 JUN 2017.
 */
/** cesium core*/

var Cesium = require('./utils/cesium');
/**EarthTrek*/
var earthTrekSatellite = require('./earthtrek-satellite');
var EarthTrekEntity = EarthTrekEntity || {};

/**
 *
 * @param satelliteInfo
 * @param startTime
 * @returns {Cesium.Entity}
 */
EarthTrekEntity.create = function (satelliteInfo, startTime) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};


    var color = void 0;
    if (satelliteInfo.tle == undefined) {
        return false;
    }

    if (!options.model) {
        options.model = {
            show: false
        };
    }
    if (!options.billboard) {
        options.billboard = {
            show: false,
            path: 'images/satellites/',
            scale: 1
        };
    }
    if (!options.label) {
        options.label = {
            show: true
        };
    }
    if (!options.path) {
        options.path = {
            show: true
        };
    }
    if (!options.orbitColor) {
        options.orbitColor = '#F0F8FF';
    }

    if (!options.fadeOrbit) {
        options.fadeOrbit = true;
    }

    if (!options.multiplier) {
        options.multiplier = 10; //intervals
    }

    if (!options.orbitDuration) {
        options.orbitDuration = 7200; //seconds
    }
    this.orbitDuration = options.orbitDuration;
    this.frequency = options.frequency;

    this.orbitColor = Cesium.Color.fromCssColorString(options.orbitColor);
    if (options.fadeOrbit == true) {
        this.orbitMaterial = new Cesium.StripeMaterialProperty({
            evenColor: this.orbitColor.withAlpha(0.5),
            oddColor: this.orbitColor.withAlpha(0.01),
            repeat: 1,
            offset: 0.2,
            orientation: Cesium.StripeOrientation.VERTICAL
        });
    } else {
        this.orbitMaterial = this.orbitColor.withAlpha(0.5);
    }
    var samples = earthTrekSatellite.getSamples(satelliteInfo.tle[0], satelliteInfo.tle[1], startTime, this.orbitDuration, this.frequency);

    var entity = {
        id: satelliteInfo.satId,
        name: satelliteInfo.name,
        position: samples.positions,
        velocity: samples.velocities,
        altitude: samples.heights,
        path: {
            path: options.path.show,
            resolution: 5,
            material: this.orbitMaterial,
            width: 1,
            trailTime: this.orbitDuration / 2,
            leadTime: 0
        },
        label: {
            show: options.label.show,
            text: satelliteInfo.name,
            scale: 0.6,
            scaleByDistance: new Cesium.NearFarScalar(0, 1.5, 15.0e6, 0.85),
            fillColor: Cesium.Color.WHITE,
            // eyeOffset: new Cesium.Cartesian3(0.0, 300.0, 200.0),
            outlineColor: color,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL,
            horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(15, 0)
        },
        billboard: {
            show: options.billboard.show,
            imageSubRegion: new Cesium.BoundingRectangle(0, 0, 80, 80),
            image: options.billboard.path + satelliteInfo.image,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(40000.1, 150000000.0),
            scale: options.billboard.scale,
            alignedAxis: new Cesium.VelocityVectorProperty(samples.positions, true)
        },
        properties: satelliteInfo
    };

    if (options.model != undefined && options.model.show == true) {
        entity.model = {
            uri: options.model.uri != undefined ? options.model.uri : 'models/' + satelliteInfo.id + '.glb',
            minimumPixelSize: 512,
            maximumScale: 1,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 40000.0)
        };
    }
    entity.availability = this.generateInterval(satelliteInfo.launchDate, satelliteInfo.endDate);
    return entity;
};

/**
 *
 * @param launchDate
 * @param endDate
 * @returns {Cesium.TimeIntervalCollection}
 */
EarthTrekEntity.generateInterval = function (launchDate, endDate) {
    var timeInterval = new Cesium.TimeInterval({
        start: Cesium.JulianDate.fromIso8601(launchDate),
        stop: endDate == null ? Cesium.JulianDate.fromIso8601("2099-01-01") : Cesium.JulianDate.fromIso8601(endDate),
        isStartIncluded: true,
        isStopIncluded: endDate === null ? false : true
    });

    var intervalCollection = new Cesium.TimeIntervalCollection();
    intervalCollection.addInterval(timeInterval);
    return intervalCollection;
};

/**
 *
 * @param entity
 * @returns {*}
 */
EarthTrekEntity.setDefaultPath = function (entity, options) {
    if (!options.width) {
        options.width = 1;
    }
    entity._path.width = options.width;
    entity._path.material = options.orbitMaterial;
    return entity;
};

/**
 *
 * @param entity
 * @returns {*}
 */
EarthTrekEntity.setGlowPath = function (entity, currentTime) {
    var orbitColor = Cesium.Color.fromCssColorString(entity.properties.getValue(currentTime).color);
    entity._path.width = 5;
    entity._path.material = new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.4,
        color: orbitColor
    });
    return entity;
};

module.exports = EarthTrekEntity;