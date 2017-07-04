/**
 * @class EarthTrekLayer
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 25 MAY 2017
 */
import ImageryLayer from 'cesium/Source/Scene/ImageryLayer';

import earthTrekProvider from './earthtrek-provider';
import {earthTrekInstance} from './earthtrek-core';

class earthTrekLayer {

    /**
     *
     * @param today
     * @param layer
     * @param dontHide
     * @returns {ImageryLayer}
     */
    static addLayer(today, layer, dontHide) {
        if (dontHide === undefined) {
            earthTrekLayer.hideBaseLayer(layer);
        }

        let maximumLevel = (layer.format == 'image/png') ? 2 : 8;
        if (layer.maximumLevel) {
            maximumLevel = layer.maximumLevel;
        }
        const newLayerProvider = earthTrekProvider.getProvider({
            layer: layer.id,
            time: today,
            format: layer.format,
            tileMatrixSetID: "epsg4326",
            resolution: layer.resolution,
            maximumLevel: maximumLevel
        });


        if (earthTrekInstance().getViewer().scene.imageryLayers._layers[0].format == 'image/jpeg') {
            earthTrekInstance().getViewer().scene.imageryLayers._layers[0].show = false;
            //    that.viewer.scene.imageryLayers.lowerToBottom(that.viewer.scene.imageryLayers._layers[0].show = false);
        }
        const addedLayer = earthTrekInstance().getViewer().scene.imageryLayers.addImageryProvider(newLayerProvider);

        let layers = earthTrekInstance().getLayers();
        layers.push({layer: layer, cesiumLayer: addedLayer});
        layers.forEach( (objLayer) => {
            if (objLayer.layer.top != undefined && objLayer.layer.top == true) {
                earthTrekInstance().getViewer().scene.imageryLayers.raiseToTop(objLayer.cesiumLayer);
            }
        });
        return addedLayer;
        /* if (layer.format == 'image/jpeg') {
         this.layerViewer.scene.imageryLayers.lowerToBottom(addedLayer);
         }*/
    }

    /**
     * Get Imagery Layers
     * @returns {imageryLayers|{get}|*|ImageryLayerCollection}
     */
    static getImageryLayers() {
        return earthTrekInstance().getViewer().scene.imageryLayers;
    }

    /**
     * Remove Layer
     * @param object layer
     * @returns {boolean}
     */
    static searchLayer (layer, callback) {
        const imageryLayers = earthTrekLayer.getImageryLayers();
        if (layer instanceof ImageryLayer) {
            callback(layer);
            return true;
        }
        for (var i = 0; i <= imageryLayers.length - 1; i++) {
            let imageryLayer = imageryLayers.get(i);
            if (imageryLayer.imageryProvider._layer == layer.id) {
                callback(imageryLayer);
                return true;
            }
        }
        return false;
    }

    /**
     * Hide Layer
     * @param object layer
     */
    static hideLayer (layer) {
        earthTrekLayer.searchLayer (layer, (imageryLayer) => {
            imageryLayer.show = false;
            earthTrekInstance().raise('layer-hidden', {'imageryLayer': imageryLayer});
        });
    }

    /**
     * Hide Layer
     * @param object layer
     */
    static removeLayer (layer) {
        earthTrekLayer.searchLayer (layer, (imageryLayer) => {
            earthTrekLayer.getImageryLayers().remove(imageryLayer);
            earthTrekInstance().raise('layer-removed', {'imageryLayer': imageryLayer});
        });
    }

    /**
     * Hide Layer
     * @param object layer
     */
    static hideBaseLayer (layer) {
        const imageryLayers = earthTrekLayer.getImageryLayers();
        for (var i = 0; i <= imageryLayers.length - 1; i++) {
            let imageryLayer = imageryLayers.get(i);
            if (layer.format == 'image/jpeg' && imageryLayer.imageryProvider.format == 'image/jpeg') {
                imageryLayer.show = false;
            }
        }
    }

    /**
     * Toggle Layer By Id
     * @param layerId
     * @param callback
     */
    static toggleLayerById (layerId, callback) {
        const imageryLayers = earthTrekLayer.getImageryLayers();
        for (var i = 0; i <= imageryLayers.length - 1; i++) {
            let imageryLayer = imageryLayers.get(i);
            if (imageryLayer.imageryProvider._layer == layerId) {
                imageryLayer.show = !imageryLayer.show;
                callback(imageryLayer.show);
            }
        }
    }

    /**
     * Raise to Top Layer
     * @param object plainLayer
     * @param ImageryLayer layer
     */
    static raiseToTop(plainLayer, layer) {
        if (plainLayer.top != undefined && plainLayer.top == true) {
            earthTrekInstance().getViewer().scene.imageryLayers.raiseToTop(layer);
        }
    }

}
module.exports = earthTrekLayer;