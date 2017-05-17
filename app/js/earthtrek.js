/**
 * @class EarthTrek
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */


define([
    'cesium',
    'earthtrek-satellite',
    'view/satellite-toolbar-view',
    'view/satellite-panel-view'
], function (ce, earthTrekSatellitez, SatelliteToolbarView, SatellitePanelView) {
    'use strict';

    /**
     * @param options
     * @constructor
     */
    function EarthTrek(options) {
        options = options || {};
        this.options = options;

        if (!options.mainContainer) {
            throw new Error('Invalid Main Container');
        }

        if (!options.startTime) {
            throw new Error('Invalid Start Time');
        }

        if (!options.endTime) {
            throw new Error('Invalid End Time');
        }
        if (!options.initialTime) {
            this.initialTime = Cesium.JulianDate.fromDate(
                new Date(options.endTime));
        }

        if (!options.orbitDuration) {
            options.orbitDuration = 7200; //seconds
        }

        if (!options.frequency) {
            options.frequency = 50; //intervals
        }

        if (!options.multiplier) {
            options.multiplier = 10; //intervals
        }

        if (!options.maxDistanceCamera) {
            options.maxDistanceCamera = 10000000000; //10,000,000,000 meters
        }

        this.startTime = Cesium.JulianDate.fromDate(
            new Date(options.startTime));
        this.endTime = Cesium.JulianDate.fromDate(
            new Date(options.endTime));
        this.initialTime = Cesium.JulianDate.fromDate(
            new Date(options.initialTime));

        this.previousTime = this.initialTime;
        this.lastPropagationTime = this.initialTime;

        this.mainContainerId = options.mainContainer;
        this.orbitDuration = options.orbitDuration;
        this.frequency = options.frequency;
        this.multiplier = options.multiplier;
        this.maxDistanceCamera = options.maxDistanceCamera;
        this.entities = [];
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
                multiplier: this.multiplier,
                clockStep: Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
            });
        }
        return this.clock;
    }

    /**
     * @param mainContainer
     * @returns {Cesium.Viewer|*}
     */
    EarthTrek.prototype.createViewer = function () {
        if (this.viewer === undefined) {
            this.viewer = new Cesium.Viewer(this.mainContainerId, {
                clock: this.getClock(),
                baseLayerPicker: false,
                requestWaterMask: true,
                automaticallyTrackDataSourceClocks: false,
                navigationHelpButton: false,
                infoBox: false,
                creditContainer: "credit"
            });

            this.getClock().onTick.addEventListener(this.onClockUpdate, this);
            this.viewer.timeline.zoomTo(this.startTime, this.endTime);
            this.viewer.camera.frustum.far = this.maxDistanceCamera;
        }
        return this.viewer;
    }

    EarthTrek.prototype.init = function () {

        var that = this;
        var satellitePanel = new SatellitePanelView(this.viewer, 'satellite-panel');
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            var pick = that.viewer.scene.pick(movement.position);
            if (Cesium.defined(pick)) {
                var entity = that.viewer.entities.getById(pick.id._id);
                if (entity != undefined) {
                    satellitePanel.show(entity);
                }
            } else  {
                that.viewer.trackedEntity = undefined;
                satellitePanel.hide();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

        this.satelliteToolbar = new SatelliteToolbarView(this.viewer, 'left-toolbar', satellitePanel);
        $.getJSON("data/instruments.json", function (satellites) {
            satellites.forEach(function (satelliteData) {
                var entity = that.viewer.entities.getById(satelliteData.id);
                if (entity == null && satelliteData.status == 'ACTIVE') {
                    entity = that.createEntity(satelliteData, that.clock.currentTime);
                    that.entities.push(entity);
                    that.satelliteToolbar.addSatellite(satelliteData, that.goToEntity);
                }
            })
            that.satelliteToolbar.render();
        });
    }

    EarthTrek.prototype.isoDate = function (isoDateTime) {
        return isoDateTime.split("T")[0];
    };

    EarthTrek.prototype.onClockUpdate = function (clock) {
        var isoDateTime = clock.currentTime.toString();
        var time = this.isoDate(isoDateTime);
        this.updateEntities(time);
        if (time !== this.previousTime) {
            this.previousTime = time;
          //  updateLayers();
        }
    };

    /**
     *
     * @param satelliteInfo
     * @param startTime
     * @returns {Cesium.Entity}
     */
    EarthTrek.prototype.createEntity = function (satelliteInfo, startTime) {

        //var position = Cesium.Cartesian3.fromDegrees(307.56125, -47.846016, height);
        //  var heading = Cesium.Math.toRadians(135);
        var pitch = 0;
        var roll = 0;
        //  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
        // var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

        var color = Cesium.Color.fromRandom({
            minimumRed: 0.35,
            minimumGreen: 0.15,
            minimumBlue: 0.45,
            alpha: 1.0
        });

        if (satelliteInfo.tle == undefined) {
            return false;
        }

        var positions = earthTrekSatellite.getSamples(satelliteInfo.tle.line1, satelliteInfo.tle.line2, startTime, this.orbitDuration, this.frequency);

        var entity = this.viewer.entities.add({
            id: satelliteInfo.id,
            name: satelliteInfo.name,
            position: positions,
            orientation: new Cesium.VelocityOrientationProperty(positions),
            model: {
                uri: 'models/' + satelliteInfo.id + '.glb',
                minimumPixelSize: 512,
                maximumScale: 1,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 40000.0)
            },
            path: {
                resolution: 5,
                material: new Cesium.PolylineGlowMaterialProperty({
                    glowPower: 0.2,
                    color: color
                }),
                width: 7,
                trailTime: this.orbitDuration,
                leadTime: 0
            },
            label: {
                show: true,
                text: satelliteInfo.name,
                scale: 0.6,
                scaleByDistance: new Cesium.NearFarScalar(0, 1.5, 15.0e6, 0.85),
                fillColor: Cesium.Color.WHITE,
               // eyeOffset: new Cesium.Cartesian3(0.0, 300.0, 200.0),
                outlineColor: color,
                outlineWidth: 3,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset:  new Cesium.Cartesian2(0, -15)
            //    heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND
            },
            billboard: {
                image: 'images/satellites/' + satelliteInfo.image,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(40000.1, 150000000.0),
                scale: 0.35
            },
            properties: satelliteInfo
        });

        entity.availability = this.generateInterval(satelliteInfo.launchDate, satelliteInfo.endDate);
        return entity;
    }

    /**
     *
     * @param launchDate
     * @param endDate
     * @returns {Cesium.TimeIntervalCollection}
     */
    EarthTrek.prototype.generateInterval = function (launchDate, endDate) {
        var timeInterval = new Cesium.TimeInterval({
            start: Cesium.JulianDate.fromIso8601(launchDate),
            stop: (endDate == null) ? Cesium.JulianDate.fromIso8601("2099-01-01") : Cesium.JulianDate.fromIso8601(endDate),
            isStartIncluded: true,
            isStopIncluded: (endDate === null) ? false : true
        });

        var intervalCollection = new Cesium.TimeIntervalCollection();
        intervalCollection.addInterval(timeInterval);
        return intervalCollection;
    }

    /**
     *
     */
    EarthTrek.prototype.updateEntities = function (time) {
        if (Cesium.JulianDate.secondsDifference(this.clock.currentTime, this.lastPropagationTime) > this.orbitDuration ||
            Cesium.JulianDate.secondsDifference(this.lastPropagationTime, this.clock.currentTime) > this.orbitDuration) {
            this.lastPropagationTime = this.clock.currentTime;
            var that = this;
            this.entities.forEach(function (entity) {
                var newStart = that.clock.currentTime;
                var tle1 = entity.properties.getValue(newStart).tle.line1;
                var tle2 = entity.properties.getValue(newStart).tle.line2;
                entity.position = earthTrekSatellite.getSamples(tle1, tle2, newStart, that.orbitDuration, that.frequency);

                SatelliteToolbarView.prototype.updateSatellite(entity, that.goToEntity, time);
            });
            console.log("PROPAGO");
        }
    }

    EarthTrek.prototype.goToEntity = function (entity, panel, viewer) {
        if (entity == undefined) {
            return false;
        }
        /**
         * TODO FIX THIS
         */
        if (this != undefined) {
            viewer = this.viewer;
        }
        panel.show(entity);
        viewer.trackedEntity = entity;
        viewer.selectedEntity = entity;
        return true;
    }

    return EarthTrek;
    module.exports = EarthTrek;
});