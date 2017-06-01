window.CESIUM_BASE_URL = './';
require('cesium/Build/CesiumUnminified/Cesium.js');
require('cesium/Build/Cesium/Widgets/widgets.css');

var Cesium = window.Cesium;

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
                url: 'assets/imagery/NaturalEarthII/',
                maximumLevel: 5,
                credit: 'Imagery courtesy Natural Earth',
                fileExtension: 'jpg'
            }),
        });
        this.viewer.scene.globe.tileCacheSize = 1000;
        this.viewer.scene.globe.enableLighting = this.enableLighting;
        //this.getClock().onTick.addEventListener(this.onClockUpdate, this);
        this.viewer.timeline.zoomTo(this.startTime, this.endTime);
        this.viewer.camera.frustum.far = this.maxDistanceCamera;
    }
    return this.viewer;
}

/**
 *
 * @param isoDateTime
 * @returns {*}
 */
EarthTrek.prototype.isoDate = function (isoDateTime) {
    return isoDateTime.split("T")[0];
};
module.exports = EarthTrek;