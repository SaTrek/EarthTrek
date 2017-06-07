/**
 * @class EarthTrek
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */
window.CESIUM_BASE_URL = './';
var Cesium = require('./cesium');
require('cesium/Build/Cesium/Widgets/widgets.css');
var _ = require('underscore');

var earthTrekLayer = require('./earthtrek-layer');
var earthTrekData = require('./earthtrek-data');
var SatellitePanelView = require('./view/satellite-panel-view');
var SatelliteToolbarView = require('./view/satellite-toolbar-view');
var EarthTrekView = require('./view/earthtrek-view');
var earthTrekSatellite = require('./earthtrek-satellite');
var EarthTrekEntity = require('./earthtrek-entity');
var EarthTrekHandler = require('./earthtrek-handler');
var EarthTrekTutorialView = require('./view/earthtrek-tutorial-view');
//var Cesium = window.Cesium;

/**
 * @param options
 * @constructor
 */
function EarthTrek(options) {
    var options = options || {};
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

    if (!options.enableLighting) {
        options.enableLighting = false;
    }
    if (!options.orbitColor) {
        options.orbitColor = '#F0F8FF';
    }
    if (!options.fadeOrbit) {
        options.fadeOrbit = true;
    }
    this.startTime = Cesium.JulianDate.fromDate(
        new Date(options.startTime));
    this.endTime = Cesium.JulianDate.fromDate(
        new Date(options.endTime));
    this.initialTime = Cesium.JulianDate.fromDate(
        new Date(options.initialTime));

    this.previousTime = this.isoDate(this.initialTime.toString());
    this.lastPropagationTime = this.initialTime;

    this.mainContainerId = options.mainContainer;
    this.orbitDuration = options.orbitDuration;
    this.frequency = options.frequency;
    this.multiplier = options.multiplier;
    this.maxDistanceCamera = options.maxDistanceCamera;
    this.enableLighting = options.enableLighting;

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

    this.entities = [];
}

/**
 * getClock
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
 * Create Viewer
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
            creditContainer: "credit",
            terrainExaggeration: 10,
            // shadows: Cesium.ShadowMode.ENABLED,
            imageryProvider: new Cesium.createTileMapServiceImageryProvider({
                url: 'newassets/imagery/NaturalEarthII/',
                maximumLevel: 5,
                credit: 'Imagery courtesy Natural Earth',
                fileExtension: 'jpg'
            }),
        });
        this.viewer.scene.globe.tileCacheSize = 1000;
        this.viewer.scene.globe.enableLighting = this.enableLighting;
        this.getClock().onTick.addEventListener(this.onClockUpdate, this);
        this.viewer.timeline.zoomTo(this.startTime, this.endTime);
        this.viewer.camera.frustum.far = this.maxDistanceCamera;
        this.viewer.camera.defaultZoomAmount = 500000.0;
    }
    return this.viewer;
}

/**
 *
 */
EarthTrek.prototype.showWelcomeScreen = function () {
    var mainView = new EarthTrekView(this.viewer, {showTutorial: false});
    if (localStorage.getItem("started") == null) {
        var tutorialView = new EarthTrekTutorialView(this.viewer);
        mainView.welcome(tutorialView);

        this.evt.addEventListener(tutorialView.thirdStep, tutorialView);
    }
}

/**
 * Init
 */
EarthTrek.prototype.init = function () {
    var that = this;
    earthTrekLayer.setViewer(this.viewer);

    this.lastOrbitalDataUpdated = this.clock.currentTime;

    this.evt = new Cesium.Event();

    var satellitePanel = new SatellitePanelView(this.viewer, {
        container: 'satellite-panel'
    });
    this.satellitePanel = satellitePanel;
    this.addHandlers(satellitePanel);

    this.showWelcomeScreen();
    this.satelliteToolbar = new SatelliteToolbarView(this.viewer, 'left-toolbar', satellitePanel);

    earthTrekData.getFullData({}, function (satellites) {
        satellites.forEach(function (satelliteData) {
            var entity = that.viewer.entities.getById(satelliteData.satId);
            if (entity == null && satelliteData.status == 'ACTIVE') {
                entity = that.viewer.entities.add(EarthTrekEntity.create(satelliteData, that.clock.currentTime, {
                    orbitDuration: that.orbitDuration,
                    frequency: that.frequency
                }));
                that.entities.push(entity);
                that.satelliteToolbar.addSatellite(satelliteData, that.goToEntity);
            }
        })
        that.satelliteToolbar.render();
    });
}


EarthTrek.prototype.addHandlers = function (satellitePanel) {
    var that = this;
    var handler = new EarthTrekHandler(this.viewer);
    handler.onLeftClick(
        function (pickedEntity) {
            EarthTrekEntity.setDefaultPath(pickedEntity, {width: 1, orbitalMaterial: that.orbitalMaterial});
        },
        function(entity) {
            EarthTrekEntity.setGlowPath(entity, that.viewer.clock.currentTime);
            //el show PASARLO A EVENTO
            satellitePanel.show(entity);
            that.evt.raiseEvent(entity);
        },
        function() {
            //el hide PASARLO A EVENTO
            satellitePanel.hide();
            that.viewer.trackedEntity = undefined;
        }
    );

    handler.onMouseMove(
        function(entity) {
            EarthTrekEntity.setGlowPath(entity, that.viewer.clock.currentTime);
        },
        function(entity) {
            EarthTrekEntity.setDefaultPath(entity, {width: 1, orbitalMaterial: that.orbitalMaterial});
        }
    );
};

/**
 *
 * @param isoDateTime
 * @returns {*}
 */
EarthTrek.prototype.isoDate = function (isoDateTime) {
    return isoDateTime.split("T")[0];
};

/**
 * onClockUpdate
 * @param clock
 */
EarthTrek.prototype.onClockUpdate = function (clock) {
    var isoDateTime = clock.currentTime.toString();
    var time = this.isoDate(isoDateTime);
    if (time !== this.previousTime) {

        if (this.viewer.selectedEntity != null) {
            SatelliteLayerView.updateLayers(
                {data: {entity: this.viewer.selectedEntity, panel: this.satellitePanel}},
                time
            );
        }
        //  updateLayers();
    }
    this.updateEntities(time);

    if (this.viewer.selectedEntity != null && (Cesium.JulianDate.secondsDifference(this.clock.currentTime, this.lastOrbitalDataUpdated) > 10 ||
        Cesium.JulianDate.secondsDifference(this.lastOrbitalDataUpdated, this.clock.currentTime) > 10)) {
        this.satellitePanel.updateOrbitalData(this.viewer.selectedEntity);
        this.lastOrbitalDataUpdated = this.clock.currentTime;
    }
};


/**
 * Update Entities
 * @param time
 */
EarthTrek.prototype.updateEntities = function (time) {
    var that = this;
    if (Cesium.JulianDate.secondsDifference(this.clock.currentTime, this.lastPropagationTime) > this.orbitDuration ||
        Cesium.JulianDate.secondsDifference(this.lastPropagationTime, this.clock.currentTime) > this.orbitDuration) {

        var p1 = new Promise(
            function (resolve, reject) {
                if (time !== that.previousTime) {
                    that.previousTime = time;
                    that.lastPropagationTime = that.clock.currentTime;
                    var startDate = new Date(time);
                    startDate.setDate(startDate.getDate());
                    var endDate = new Date(time);
                    endDate.setDate(endDate.getDate() + 1);
                    return resolve(earthTrekData.getTLEs(earthTrekData.getSatelliteIds(), {
                        startDate: startDate,
                        endDate: endDate
                    }));
                } else {
                    reject(time);
                }
            }
        );

        p1.then(function (tles) {
            tles.data.forEach(function (tle) {
                var entity = that.viewer.entities.getById(tle.satId);
                if (entity != null) {
                    entity.properties.tle.setValue(tle.tle);
                    entity.properties.data.setValue(_.extend(entity.properties.data.getValue(), tle.data));
                }
            });
            return new Promise(propagation);
        }, function (time) {
            return new Promise(propagation);
        });

        var propagation = function () {
            that.entities.forEach(function (entity) {
                var newStart = that.clock.currentTime;
                var tle1 = entity.properties.getValue(newStart).tle[0];
                var tle2 = entity.properties.getValue(newStart).tle[1];
                var samples = earthTrekSatellite.getSamples(tle1, tle2, newStart, that.orbitDuration, that.frequency);
                entity.position = samples.positions
                entity.velocity = samples.velocities;
                entity.altitude = samples.heights;
                SatelliteToolbarView.prototype.updateSatellite(entity, that.goToEntity, newStart);
            });
            that.lastPropagationTime = that.clock.currentTime;
        };
    }
}

/**
 * Goto Entity
 * @param entity
 * @param panel
 * @param viewer
 * @returns {boolean}
 */
EarthTrek.prototype.goToEntity = function (entity, panel, viewer, track) {
    /**
     * @TODO FIX THIS
     */
    if (this != undefined && viewer == undefined) {
        viewer = this.viewer;
    }
    console.log(viewer.clock.currentTime)
    if (entity == undefined || !entity.isAvailable(viewer.clock.currentTime)) {
        return false;
    }
    panel.show(entity);

    //.setGlowPath(entity);
    /*
     viewer.camera.flyTo({
     destination : position,
     complete: function() {
     viewer.trackedEntity = entity
     }
     });*/
    if (track == null) {
        track = false;
    }
    if (track == true) {
        viewer.trackedEntity = entity;
    } else {
        var position = entity.position.getValue(viewer.clock.currentTime);
        if (position.z > 0) {
            position.z = 30000000;
        } else {
            position.z = -30000000;
        }
        viewer.camera.flyTo({
            destination : position,
            complete: function() {
                //viewer.trackedEntity = entity
            }
        });
    }
    viewer.selectedEntity = entity;
    return true;
}

module.exports = EarthTrek;