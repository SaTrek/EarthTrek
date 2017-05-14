/**
 * @class EarthTrek
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */
define([
    'cesium',
    'earthtrek-satellite'
], function (Cesiuma, earthTrekSatellitea) {

    /**
     * @param startTime
     * @param endTime
     * @param initialTime
     * @constructor
     */
    function EarthTrek(startTime, endTime, initialTime) {
        this.startTime = Cesium.JulianDate.fromDate(
            new Date(startTime));
        this.endTime = Cesium.JulianDate.fromDate(
            new Date(endTime));
        this.initialTime = Cesium.JulianDate.fromDate(
            new Date(initialTime));

        this.previousTime = this.initialTime;
        this.defaultOrbitDuration = 7200;
    }

    /**
     *
     * @returns {Cesium.Clock|*}
     */
    EarthTrek.prototype.getClock = function () {
        if (this.clock === undefined) {
            this.clock = new Cesium.Clock({
                startTime: this.startTime,
                endTime: this.endTime,
                currentTime: this.initialTime,
                multiplier: 10,
                clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
            });
        }
        return this.clock;
    }

    /**
     * @param mainContainer
     * @returns {Cesium.Viewer|*}
     */
    EarthTrek.prototype.createViewer = function (mainContainer, maxDistanceCamera) {
        if (this.viewer === undefined) {
            this.viewer = new Cesium.Viewer(mainContainer, {
                clock: this.getClock(),
                baseLayerPicker: false, // Only showing one layer in this demo,
                requestWaterMask: true,
                automaticallyTrackDataSourceClocks: false,
                navigationHelpButton: false,
                infoBox: false
            });

            this.getClock().onTick.addEventListener(this.onClockUpdate, this);
        }
        this.viewer.camera.frustum.far = maxDistanceCamera;
        return this.viewer;
    }

    EarthTrek.prototype.isoDate = function(isoDateTime) {
        return isoDateTime.split("T")[0];
    };

    EarthTrek.prototype.onClockUpdate = function (clock) {
        var isoDateTime = clock.currentTime.toString();
        var time = this.isoDate(isoDateTime);
         //updateSatellites();
         if (time !== this.previousTime) {
            this.previousTime = time;
             //   updateLayers();

             if (this.viewer.selectedEntity != null) {
             //     showSatelliteToolbar(this.viewer.selectedEntity);
             }
         }
    };

    /**
     *
     * @param callback
     */
    EarthTrek.prototype.createEntities = function (satellites, callback) {
        // var toolbarContainer = $("#left-toolbar");
        var that = this;
        satellites.forEach(function (satelliteInfo) {
            var entity = that.viewer.entities.getById(satelliteInfo.id);
            if (entity == null && satelliteInfo.status == 'ACTIVE') {
                entity = that.createEntity(satelliteInfo, that.clock.currentTime);
               // callback(satelliteInfo, entity);

                // addSatelliteToToolbar(satelliteInfo, toolbarContainer);
            }
        });

      /*  $(toolbarContainer).slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            variableWidth: true
        });*/
    }

    EarthTrek.prototype.createEntity = function (satelliteInfo, startTime) {

        //var position = Cesium.Cartesian3.fromDegrees(307.56125, -47.846016, height);
        //  var heading = Cesium.Math.toRadians(135);
        var pitch = 0;
        var roll = 0;
        //  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        // var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        var duration = 7200; //seconds
        var frequency = 50; //hertz
        var color = Cesium.Color.fromRandom({
            minimumRed: 0.35,
            minimumGreen: 0.15,
            minimumBlue: 0.45,
            alpha: 1.0
        });

        if (satelliteInfo.tle == undefined) {
            return false;
        }

        var positions = earthTrekSatellite.getSamples(satelliteInfo.tle.line1, satelliteInfo.tle.line2, startTime, duration, frequency);

        var url = 'models/' + satelliteInfo.id + '.glb';
        var entity = this.viewer.entities.add({
            id: satelliteInfo.id,
            name: satelliteInfo.name,
            position: positions,
            orientation: new Cesium.VelocityOrientationProperty(positions),
            model: {
                uri: url,
                minimumPixelSize: 512,
                maximumScale: 1,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000.0)
            },
            path: {
                resolution: 5,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: color
                }),
                width: 7,
                trailTime: duration,
                leadTime: 0
            },
            label: {
                show: true,
                text: satelliteInfo.name,
                scale: 0.7,
                //  scaleByDistance: new Cesium.NearFarScalar(0, 1.5, 8.0e6, 0.5),
                fillColor: Cesium.Color.WHITE,
                eyeOffset: new Cesium.Cartesian3(0.0, 5.0, 100.0),
                outlineColor: color,
                outlineWidth: 3,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE
            },
            billboard: {
                image: 'images/satellites/' + satelliteInfo.image,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(50000.1, 150000000.0),
                scale: 0.3
            },
            properties: satelliteInfo
        });

        var timeInterval = new Cesium.TimeInterval({
            start: Cesium.JulianDate.fromIso8601(satelliteInfo.launchDate),
            stop: Cesium.JulianDate.fromIso8601("2099-01-01"),
            isStartIncluded: true,
            isStopIncluded: false
        });

        if (satelliteInfo.endDate != null) {
            timeInterval.stop = Cesium.JulianDate.fromIso8601(satelliteInfo.endDate);
            timeInterval.isStopIncluded = true;
        }
        var intervalCollection = new Cesium.TimeIntervalCollection();
        intervalCollection.addInterval(timeInterval);
        entity.availability = intervalCollection;
        return entity;
    }

    return EarthTrek;
    module.exports = EarthTrek;
});