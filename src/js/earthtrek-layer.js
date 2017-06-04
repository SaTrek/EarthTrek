/**
 * @class EarthTrekLayers
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 2017-05-25
 */
var earthTrekLayer = earthTrekLayer || {};
define([
    'cesium',
    'earthtrek-provider',
], function() {

    earthTrekLayer.setViewer = function(viewer) {
        this.layerViewer = viewer;
    }

    earthTrekLayer.addLayer = function(today, layer, dontHide) {
        if (dontHide === undefined) {
            earthTrekLayer.hideLayer(layer);
        }
        var maximumLevel = (layer.format == 'image/png') ? 2 : 12;
        var newLayerProvider = earthTrekProvider.getProvider({
            layer: layer.id,
            time: today,
            format: layer.format,
            tileMatrixSetID: "epsg4326",
            resolution: layer.resolution,
            maximumLevel: maximumLevel
        });

        if (this.layerViewer.scene.imageryLayers._layers[0].format == 'image/jpeg') {
            this.layerViewer.scene.imageryLayers._layers[0].show = false;
            //    that.viewer.scene.imageryLayers.lowerToBottom(that.viewer.scene.imageryLayers._layers[0].show = false);
        }
        var addedLayer = this.layerViewer.scene.imageryLayers.addImageryProvider(newLayerProvider);
        return addedLayer;
        if (layer.format == 'image/jpeg') {
            this.layerViewer.scene.imageryLayers.lowerToBottom(addedLayer);
        }
    }

    earthTrekLayer.getLayers = function() {
        return this.layerViewer.scene.imageryLayers;
    }

    earthTrekLayer.toggleLayer = function() {
    }

    earthTrekLayer.removeLayer = function(layer) {
        var imageryLayers = earthTrekLayer.getLayers();
        if (layer instanceof Cesium.ImageryLayer) {
            console.log("Removio")
            imageryLayers.remove(layer);
            return true;
        }
        for (var i = 0; i <= imageryLayers.length - 1; i++) {
            var imageryLayer = imageryLayers.get(i);
            if (imageryLayer.imageryProvider._layer == layer.id) {
                console.log("Removio")
                imageryLayers.remove(imageryLayer);
                return true;
            }
        }
        return false;
    }

    earthTrekLayer.hideLayer = function(layer) {
        var imageryLayers = earthTrekLayer.getLayers();
        for (var i = 0; i <= imageryLayers.length - 1; i++) {
            var imageryLayer = imageryLayers.get(i);
            if (layer.format == 'image/jpeg' && imageryLayer.imageryProvider.format == 'image/jpeg') {
                console.log("Oculto")
                imageryLayer.show = false;
            }
        }
    }
});