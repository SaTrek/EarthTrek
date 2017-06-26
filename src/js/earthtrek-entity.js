/**
 * @class EarthTrekEntity
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 2 JUN 2017.
 */
/** cesium core*/
var JulianDate = require('cesium/Source/Core/JulianDate');
var TimeInterval = require('cesium/Source/Core/TimeInterval');
var TimeIntervalCollection = require('cesium/Source/Core/TimeIntervalCollection');

var DistanceDisplayCondition = require('cesium/Source/Core/DistanceDisplayCondition')
var NearFarScalar = require('cesium/Source/Core/NearFarScalar');
var Cartesian2 = require('cesium/Source/Core/Cartesian2');
var Color = require('cesium/Source/Core/Color');
var BoundingRectangle = require('cesium/Source/Core/BoundingRectangle');

var LabelStyle = require('cesium/Source/Scene/LabelStyle');
var HorizontalOrigin = require('cesium/Source/Scene/HorizontalOrigin');
var VerticalOrigin = require('cesium/Source/Scene/VerticalOrigin');

var VelocityVectorProperty = require('cesium/Source/DataSources/VelocityVectorProperty');
var PolylineGlowMaterialProperty =require('cesium/Source/DataSources/PolylineGlowMaterialProperty');

var Cesium = require('./utils/cesium');
/**EarthTrek*/
var earthTrekSatellite = require('./earthtrek-satellite');
var EarthTrekEntity = EarthTrekEntity || {};
/*
 function EarthTrekEntity(options) {
 this.orbitDuration = options.orbitDuration;
 this.frequency = options.frequency;
 }*/

/**
 *
 * @param satelliteInfo
 * @param startTime
 * @returns {Cesium.Entity}
 */
EarthTrekEntity.create = function (satelliteInfo, startTime, options = {}) {

    let color;
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
    const samples = earthTrekSatellite.getSamples(satelliteInfo.tle[0], satelliteInfo.tle[1], startTime, this.orbitDuration, this.frequency);

    let entity = {
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
            scaleByDistance: new NearFarScalar(0, 1.5, 15.0e6, 0.85),
            fillColor: Color.WHITE,
            // eyeOffset: new Cesium.Cartesian3(0.0, 300.0, 200.0),
            outlineColor: color,
            outlineWidth: 3,
            style: LabelStyle.FILL,
            horizontalOrigin: HorizontalOrigin.LEFT,
            verticalOrigin: VerticalOrigin.BOTTOM,
            pixelOffset: new Cartesian2(15, 0)
        },
        billboard: {
            show: options.billboard.show,
            imageSubRegion: new BoundingRectangle(0, 0, 80, 80),
            image:  options.billboard.path + satelliteInfo.image,
            distanceDisplayCondition: new DistanceDisplayCondition(40000.1, 150000000.0),
            scale: options.billboard.scale,
            alignedAxis : new VelocityVectorProperty(samples.positions, true)
        },
        properties: satelliteInfo
    };

    if (options.model != undefined && options.model.show == true) {
        entity.model = {
            uri: options.model.uri != undefined ? options.model.uri : 'models/' + satelliteInfo.id + '.glb',
            minimumPixelSize: 512,
            maximumScale: 1,
            distanceDisplayCondition: new DistanceDisplayCondition(0.0, 40000.0)
        };
    }
    entity.availability = this.generateInterval(satelliteInfo.launchDate, satelliteInfo.endDate);
    return entity;
}

/**
 *
 * @param launchDate
 * @param endDate
 * @returns {Cesium.TimeIntervalCollection}
 */
EarthTrekEntity.generateInterval = function (launchDate, endDate) {
    var timeInterval = new TimeInterval({
        start: JulianDate.fromIso8601(launchDate),
        stop: (endDate == null) ? JulianDate.fromIso8601("2099-01-01") : JulianDate.fromIso8601(endDate),
        isStartIncluded: true,
        isStopIncluded: (endDate === null) ? false : true
    });

    var intervalCollection = new TimeIntervalCollection();
    intervalCollection.addInterval(timeInterval);
    return intervalCollection;
}

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
}

/**
 *
 * @param entity
 * @returns {*}
 */
EarthTrekEntity.setGlowPath = function (entity, currentTime) {
    var orbitColor = Color.fromCssColorString(entity.properties.getValue(currentTime).color);
    entity._path.width = 5;
    entity._path.material = new PolylineGlowMaterialProperty({
        glowPower: 0.4,
        color: orbitColor
    });
    return entity;
}


module.exports = EarthTrekEntity;