import Cesium from './cesium';
class EarthTrekCesiumAdapter {

    constructor(options) {
        if (!options.mainContainer) {
            throw new Error('Invalid Main Container');
        }
        this.mainContainerId = options.mainContainer;
        if (!options.initialTime) {
            this.initialTime = Cesium.JulianDate.fromDate(new Date(options.endTime));
        }

        this.startTime = this.engine.JulianDate.fromDate(new Date(options.startTime));
        this.endTime = this.engine.JulianDate.fromDate(new Date(options.endTime));
        this.initialTime = this.engine.JulianDate.fromDate(new Date(options.initialTime));
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
     * Get Viewer
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

}