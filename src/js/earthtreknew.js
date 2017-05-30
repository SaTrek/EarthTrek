
var Cesium = require('cesium/Source/Cesium');
function EarthTrek(options) {

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
module.exports = EarthTrek;