/**
 * @class EarthTrek
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */
/**EXTERNAL */
import events from 'events';
import Cesium from './utils/cesium';
import _ from 'underscore';
/***/
import EarthTrekEntity from './earthtrek-entity';
import earthTrekData from './earthtrek-data';
import earthTrekSatellite from './earthtrek-satellite';
import EarthTrekLayerCollection from './earthtrek-layer-collection';

import earthTrekUtils from './utils/earthtrek-utils';

let instance = null;

/**
 *
 * @returns {*}
 */
export function earthTrekInstance() {
    return instance;
}

export default class EarthTrekCore {

    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        window.CESIUM_BASE_URL = './';
        require('cesium/Build/Cesium/Widgets/widgets.css');

        require('../../src/css/main.css');
        require('../../src/css/left-toolbar.css');
        if(!instance){
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
            this.initialTime = Cesium.JulianDate.fromDate(
                new Date(options.endTime));
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
            options.multiplier = 10;
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

        if (!options.viewAdapter) {
            options.viewAdapter = 50; //intervals
        }

        this.startTime = Cesium.JulianDate.fromDate(
            new Date(options.startTime));
        this.endTime = Cesium.JulianDate.fromDate(
            new Date(options.endTime));
        this.initialTime = Cesium.JulianDate.fromDate(
            new Date(options.initialTime));

        if (options.imageryProvider != undefined) {
            this.imageryProvider = options.imageryProvider;
        }
        this.previousTime = earthTrekUtils.isoDate(this.initialTime.toString());
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
        this.layers = new EarthTrekLayerCollection();
        this.eventEmitter = new events.EventEmitter();
        this.createViewer();
        return instance;
    }

    getLayers() {
        return this.layers;
    }

    /**
     *
     * @returns {events.EventEmitter}
     */
    getEventEmitter()
    {
        return this.eventEmitter;
    }

    /**
     * getClock
     * @returns {Cesium.Clock|*}
     */
    getClock() {
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
    createViewer() {
        if (this.viewer === undefined) {
            const viewerOptions = {
                clock: this.getClock(),
                baseLayerPicker: false,
                requestWaterMask: true,
                automaticallyTrackDataSourceClocks: false,
                navigationHelpButton: false,
                infoBox: false,
                creditContainer: "credit",
                terrainExaggeration: 10
            }
            if (this.imageryProvider) {
                viewerOptions.imageryProvider = this.imageryProvider;
            }
            this.viewer = new Cesium.Viewer(this.mainContainerId, viewerOptions);
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
    getViewer() {
        return this.viewer;
    }

    /**
     *  Pull Satellite Data
     * @param callback
     */
    pullSatellitesData(callback) {
        earthTrekData.getFullData({getCache: this.options.getCache},  (satellites) => {
            for (var satelliteData of satellites) {
                const entity = this.viewer.entities.getById(satelliteData.satId);
                callback(satelliteData, entity);
            };
            this.raise('entities-added', {entities: this.entities});
        });
    }

    /**
     * Add Entity
     * @param satelliteData
     */
    addEntity(satelliteData) {
        const earthTrekEntity = new EarthTrekEntity(satelliteData, this.getClock().currentTime, this.options.entities);
        const entity = this.viewer.entities.add(earthTrekEntity.getEntityData());
        this.entities.push(entity);
        this.raise('entity-added', {entity: entity, satelliteData: satelliteData, earthTrekEntity: earthTrekEntity});
    }

    /**
     * on Clock Update
     * @param clock
     */
    onClockUpdate(clock) {
        const isoDateTime = clock.currentTime.toString();
        const time = earthTrekUtils.isoDate(isoDateTime);
        if (time !== this.previousTime) {
            this.raise('date-updated', {time: time});
            //  updateLayers();
        }
        this.updateEntities(time);

        if (this.viewer.selectedEntity != null &&
            (Cesium.JulianDate.secondsDifference(this.clock.currentTime, this.lastOrbitalDataUpdated) > this.orbitalDataUpdateTime ||
            Cesium.JulianDate.secondsDifference(this.lastOrbitalDataUpdated, this.clock.currentTime) > this.orbitalDataUpdateTime)) {
            this.raise('update-orbital-data', {entity: this.viewer.selectedEntity});
            this.lastOrbitalDataUpdated = this.clock.currentTime;
        }
    };

    /**
     * Register events
     * @param event
     * @param callback
     */
    on(event, callback) {
        this.getEventEmitter().on(event, callback);
    }

    /**
     * Raise Event (alias emit)
     * @param event
     * @param params
     */
    raise(event, params = {}) {
        this.getEventEmitter().emit(event, params);
    }

    /**
     * Emit Event (alias raise)
     * @param event
     * @param params
     */
    emit(event, params = {}) {
        this.getEventEmitter().emit(event, params);
    }

    /**
     * Update Entities
     * @param isoTime
     */
    updateEntities(isoTime) {
        const currentTime = this.getClock().currentTime;
        if (Cesium.JulianDate.secondsDifference(this.getClock().currentTime, this.lastPropagationTime) > this.orbitDuration ||
            Cesium.JulianDate.secondsDifference(this.lastPropagationTime, this.getClock().currentTime) > this.orbitDuration) {

            const p1 = new Promise(
                (resolve, reject) => {
                    if (isoTime !== this.previousTime) {
                        this.previousTime = isoTime;
                        this.lastPropagationTime = currentTime;
                        const startDate = new Date(isoTime);
                        startDate.setDate(startDate.getDate());
                        const endDate = new Date(isoTime);
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

            p1.then((tles) => {
                tles.data.forEach( (tle)  =>{
                    const entity = this.viewer.entities.getById(tle.satId);
                    if (entity != null) {
                        entity.properties.tle.setValue(tle.tle);
                        entity.properties.data.setValue(_.extend(entity.properties.data.getValue(), tle.data));
                    }
                });
                return new Promise(propagation).then(() => {
                    this.raise('entities-updated');
                });
            }, (isoTime) => {
                return new Promise(propagation).then(() => {
                    this.raise('entities-updated');
                });
            });

            var that = this;
            var propagation = function(resolve) {
                that.entities.forEach( (entity) => {
                    const newStart = that.clock.currentTime;
                    const tle1 = entity.properties.getValue(newStart).tle[0];
                    const tle2 = entity.properties.getValue(newStart).tle[1];
                    const samples = earthTrekSatellite.getSamples(tle1, tle2, newStart, that.orbitDuration, that.frequency);
                    entity.position = samples.positions
                    entity.velocity = samples.velocities;
                    entity.altitude = samples.heights;
                    that.raise('entity-updated', {entity: entity, newStart: newStart});
                });
                that.lastPropagationTime = that.clock.currentTime;
                return resolve();
            };
        }

    }
}