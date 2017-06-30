'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @class EarthTrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module EarthTrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author SATrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */
/**EXTERNAL */

/***/


exports.earthTrekInstance = earthTrekInstance;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _cesium = require('./utils/cesium');

var _cesium2 = _interopRequireDefault(_cesium);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _earthtrekEntity = require('./earthtrek-entity');

var _earthtrekEntity2 = _interopRequireDefault(_earthtrekEntity);

var _earthtrekData = require('./earthtrek-data');

var _earthtrekData2 = _interopRequireDefault(_earthtrekData);

var _earthtrekSatellite = require('./earthtrek-satellite');

var _earthtrekSatellite2 = _interopRequireDefault(_earthtrekSatellite);

var _earthtrekUtils = require('./utils/earthtrek-utils');

var _earthtrekUtils2 = _interopRequireDefault(_earthtrekUtils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

window.CESIUM_BASE_URL = './';
require('cesium/Build/Cesium/Widgets/widgets.css');

require('../../src/css/main.css');
require('../../src/css/left-toolbar.css');

var instance = null;

/**
 *
 * @returns {*}
 */
function earthTrekInstance() {
    return instance;
}

var EarthTrekCore = function () {

    /**
     * Constructor
     * @param options
     */
    function EarthTrekCore(options) {
        _classCallCheck(this, EarthTrekCore);

        if (!instance) {
            instance = this;
        }

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
            this.initialTime = _cesium2.default.JulianDate.fromDate(new Date(options.endTime));
        }

        if (!options.maxDistanceCamera) {
            options.maxDistanceCamera = 10000000000; //10,000,000,000 meters
        }

        if (!options.enableLighting) {
            options.enableLighting = false;
        }
        if (!options.showFeatures) {
            options.showFeatures = true;
        }
        if (!options.orbitalDataUpdateTime) {
            options.orbitalDataUpdateTime = 10;
        }
        if (!options.multiplier) {
            options.multiplier = 10; //intervals
        }

        if (!options.orbitDuration) {
            options.orbitDuration = 7200; //seconds
        }

        if (!options.frequency) {
            options.frequency = 50; //intervals
        }

        if (!options.entities) {
            options.entities = {
                orbitDuration: options.orbitDuration,
                frequency: options.frequency
            };
        }
        if (!options.env) {
            options.env = 'dev';
        }
        this.startTime = _cesium2.default.JulianDate.fromDate(new Date(options.startTime));
        this.endTime = _cesium2.default.JulianDate.fromDate(new Date(options.endTime));
        this.initialTime = _cesium2.default.JulianDate.fromDate(new Date(options.initialTime));

        if (options.imageryProvider != undefined) {
            this.imageryProvider = options.imageryProvider;
        }
        this.previousTime = _earthtrekUtils2.default.isoDate(this.initialTime.toString());
        this.lastPropagationTime = this.initialTime;
        this.multiplier = options.multiplier;
        this.mainContainerId = options.mainContainer;
        this.maxDistanceCamera = options.maxDistanceCamera;
        this.enableLighting = options.enableLighting;
        this.orbitalDataUpdateTime = options.orbitalDataUpdateTime;

        this.orbitDuration = options.orbitDuration;
        this.frequency = options.frequency;
        if (options.env == 'dev') {
            this.debugMode = true;
        }
        this.options = options;
        this.entities = [];
        this.layers = [];
        this.eventEmitter = new _events2.default.EventEmitter();
        this.createViewer();
        return instance;
    }

    _createClass(EarthTrekCore, [{
        key: 'getLayers',
        value: function getLayers() {
            return this.layers;
        }

        /**
         *
         * @returns {events.EventEmitter}
         */

    }, {
        key: 'getEventEmitter',
        value: function getEventEmitter() {
            return this.eventEmitter;
        }

        /**
         * getClock
         * @returns {Cesium.Clock|*}
         */

    }, {
        key: 'getClock',
        value: function getClock() {
            if (this.clock === undefined) {
                this.clock = new _cesium2.default.Clock({
                    startTime: this.startTime,
                    endTime: this.endTime,
                    currentTime: this.initialTime,
                    multiplier: this.multiplier,
                    clockStep: _cesium2.default.ClockStep.SYSTEM_CLOCK_MULTIPLIER
                });
            }
            return this.clock;
        }

        /**
         * Create Viewer
         * @param mainContainer
         * @returns {Cesium.Viewer|*}
         */

    }, {
        key: 'createViewer',
        value: function createViewer() {
            if (this.viewer === undefined) {
                var viewerOptions = {
                    clock: this.getClock(),
                    baseLayerPicker: false,
                    requestWaterMask: true,
                    automaticallyTrackDataSourceClocks: false,
                    navigationHelpButton: false,
                    infoBox: false,
                    creditContainer: "credit",
                    terrainExaggeration: 10
                };
                if (!this.imageryProvider) {
                    viewerOptions.imageryProvider = this.imageryProvider;
                }
                this.viewer = new _cesium2.default.Viewer(this.mainContainerId, viewerOptions);
                this.viewer.scene.globe.tileCacheSize = 1000;
                this.viewer.scene.globe.enableLighting = this.enableLighting;
                this.getClock().onTick.addEventListener(this.onClockUpdate, this);
                this.viewer.timeline.zoomTo(this.startTime, this.endTime);
                this.viewer.camera.frustum.far = this.maxDistanceCamera;
                this.viewer.camera.defaultZoomAmount = 500000.0;

                if (this.debugMode == true) {
                    this.viewer.scene.debugShowFramesPerSecond = true;
                }
            }
            this.lastOrbitalDataUpdated = this.clock.currentTime;
            return this.viewer;
        }

        /**
         * Get Viewer
         * @returns {Cesium.Viewer}
         */

    }, {
        key: 'getViewer',
        value: function getViewer() {
            return this.viewer;
        }
    }, {
        key: 'pullSatellitesData',
        value: function pullSatellitesData(callback) {
            var _this = this;

            _earthtrekData2.default.getFullData({ getCache: this.options.getCache }, function (satellites) {
                satellites.forEach(function (satelliteData) {
                    var entity = _this.viewer.entities.getById(satelliteData.satId);
                    callback(satelliteData, entity);
                });
                _this.getEventEmitter().emit('entities-added', { entities: _this.entities });
            });
        }

        /**
         * Add Entity
         * @param satelliteData
         */

    }, {
        key: 'addEntity',
        value: function addEntity(satelliteData) {
            var entity = this.viewer.entities.add(_earthtrekEntity2.default.create(satelliteData, this.getClock().currentTime, this.options.entities));
            this.entities.push(entity);
            this.getEventEmitter().emit('entity-added', { entity: entity, satelliteData: satelliteData });
        }

        /**
         * on Clock Update
         * @param clock
         */

    }, {
        key: 'onClockUpdate',
        value: function onClockUpdate(clock) {
            var isoDateTime = clock.currentTime.toString();
            var time = _earthtrekUtils2.default.isoDate(isoDateTime);
            if (time !== this.previousTime) {
                this.getEventEmitter().emit('date-updated', { time: time });
                //  updateLayers();
            }
            this.updateEntities(time);

            if (this.viewer.selectedEntity != null && (_cesium2.default.JulianDate.secondsDifference(this.clock.currentTime, this.lastOrbitalDataUpdated) > this.orbitalDataUpdateTime || _cesium2.default.JulianDate.secondsDifference(this.lastOrbitalDataUpdated, this.clock.currentTime) > this.orbitalDataUpdateTime)) {
                this.getEventEmitter().emit('update-orbital-data', { entity: this.viewer.selectedEntity });
                this.lastOrbitalDataUpdated = this.clock.currentTime;
            }
        }
    }, {
        key: 'updateEntities',
        value: function updateEntities(isoTime) {
            var _this2 = this;

            var currentTime = this.getClock().currentTime;
            if (_cesium2.default.JulianDate.secondsDifference(this.getClock().currentTime, this.lastPropagationTime) > this.orbitDuration || _cesium2.default.JulianDate.secondsDifference(this.lastPropagationTime, this.getClock().currentTime) > this.orbitDuration) {

                var p1 = new Promise(function (resolve, reject) {
                    if (isoTime !== _this2.previousTime) {
                        _this2.previousTime = isoTime;
                        _this2.lastPropagationTime = currentTime;
                        var startDate = new Date(isoTime);
                        startDate.setDate(startDate.getDate());
                        var endDate = new Date(isoTime);
                        endDate.setDate(endDate.getDate() + 1);
                        return resolve(_earthtrekData2.default.getTLEs(_earthtrekData2.default.getSatelliteIds(), {
                            startDate: startDate,
                            endDate: endDate
                        }));
                    } else {
                        reject(time);
                    }
                });

                p1.then(function (tles) {
                    tles.data.forEach(function (tle) {
                        var entity = _this2.viewer.entities.getById(tle.satId);
                        if (entity != null) {
                            entity.properties.tle.setValue(tle.tle);
                            entity.properties.data.setValue(_underscore2.default.extend(entity.properties.data.getValue(), tle.data));
                        }
                    });
                    return new Promise(propagation).then(function () {
                        _this2.getEventEmitter().emit('entities-updated');
                    });
                }, function (isoTime) {
                    return new Promise(propagation).then(function () {
                        _this2.getEventEmitter().emit('entities-updated');
                    });
                });

                var that = this;
                var propagation = function propagation(resolve) {
                    that.entities.forEach(function (entity) {
                        var newStart = that.clock.currentTime;
                        var tle1 = entity.properties.getValue(newStart).tle[0];
                        var tle2 = entity.properties.getValue(newStart).tle[1];
                        var samples = _earthtrekSatellite2.default.getSamples(tle1, tle2, newStart, that.orbitDuration, that.frequency);
                        entity.position = samples.positions;
                        entity.velocity = samples.velocities;
                        entity.altitude = samples.heights;
                        that.getEventEmitter().emit('entity-updated', { entity: entity, newStart: newStart });
                    });
                    that.lastPropagationTime = that.clock.currentTime;
                    return resolve();
                };
            }
        }
    }]);

    return EarthTrekCore;
}();

exports.default = EarthTrekCore;