/**
 * @class EarthTrekLayerCollection
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrekCore - 08 JUL 2017.
 */
import earthTrekProvider from './earthtrek-provider';
import {ImageryLayerCollection} from './engines/cesium';
import {ImageryLayer} from './engines/cesium';
import {earthTrekInstance} from './earthtrek-core';
import 'babel-polyfill';
export default class EarthTrekLayerCollection
{
    /**
     *
     */
    constructor() {
        this.layers = [];
    }

    /**
     * Add Layer
     * @param layer
     * @returns ImageryLayer
     */
    add(layer) {
        if (layer.format == undefined) {
            throw new Error('Format undefined');
        }
        if (layer.hide == undefined) {
            layer.hide = true;
        }
        if (layer.format == 'image/jpeg' && layer.hide == true) {
            this.hideFormatLayer('image/jpeg');
        }
        if (layer.maximumLevel == undefined) {
            layer.maximumLevel = (layer.format == 'image/png') ? 2 : 8;
        }

        if (layer.removable == undefined) {
            layer.removable = true;
        }
        if (layer.top == undefined) {
            layer.top = false;
        }
        layer.tileMatrixSetID = "epsg4326";
        const newLayerProvider = earthTrekProvider.getProvider(layer);

        const addedLayer = this.getImageryLayers().addImageryProvider(newLayerProvider);
        if (this.getImageryLayers()._layers[0].format == 'image/jpeg') {
            this.getImageryLayers()._layers[0].show = false;
            //    that.viewer.scene.imageryLayers.lowerToBottom(that.viewer.scene.imageryLayers._layers[0].show = false);
        }
        layer.imagery = addedLayer;
        layer.index = this.layers.length;
        this.layers.push(layer);

        this.layers.forEach( (earthTrekLayer) => {
            this.raiseToTop(earthTrekLayer);
        });

        return layer;
    }

    [Symbol.iterator]() {
        var index = -1;
        var data  = this.layers;

        return {
            next: () => ({ value: data[++index], done: !(index in data) })
        };
    };

    length() {
        return this.layers.length;
    }

    getInstance() {
        return earthTrekInstance();
    }

    /**
     * Get Imagery Layers
     * @returns {imageryLayers|{get}|*|ImageryLayerCollection}
     */
    getImageryLayers() {
        return this.getInstance().getViewer().scene.imageryLayers;
    }

    /**
     *
     * @param format
     */
    hideFormatLayer(format) {
        return this.iterate ({}, (imageryLayer) => {
            if (imageryLayer.imageryProvider.format == format) {
                imageryLayer.show = false;
                this.getInstance().raise('layer-hidden', {'imageryLayer': imageryLayer});
                return true;
            }
        });
    }

    /**
     * Remove Layer
     * @param object layer
     * @returns {boolean}
     */
    iterate (layer, callback) {
        const imageryLayers = this.getImageryLayers();
        if (layer instanceof ImageryLayer) {
            if (callback(layer) == true) {
                return true;
            }
        }
        for (var i = 0; i <= imageryLayers.length - 1; i++) {
            let imageryLayer = imageryLayers.get(i);
            if (callback(imageryLayer) == true) {
                return true;
            }
        }
        return false;
    }

    /**
     * Hide Layer
     * @returns {boolean}
     */
    hide (layer) {
        return this.iterate(layer, (imageryLayer) => {
            if (imageryLayer.imageryProvider._layer == layer.id) {
                imageryLayer.show = false;
                this.getInstance().raise('layer-hidden', {'imageryLayer': imageryLayer});
                return true;
            }
        });
    }

    /**
     * Hide Layer
     * @returns {boolean}
     */
    remove (layer) {
        return this.iterate(layer, (imageryLayer) => {
            if (imageryLayer.imageryProvider._layer == layer.id && layer.removable != false) {
                this.layers.splice(layer.index, 1);
                this.getInstance().raise('layer-removed', {'imageryLayer': imageryLayer});
                return this.getImageryLayers().remove(imageryLayer);
            }
        });
    }

    /**
     * Toggle Layer visibility
     * @param layer
     * @param callback
     */
    toggle (layer, callback) {
        return this.iterate(layer, (imageryLayer) => {
            if (imageryLayer.imageryProvider._layer == layer.id) {
                imageryLayer.show = !imageryLayer.show;
                if (callback == undefined) {
                    return imageryLayer.show;
                }
                return callback(imageryLayer.show);
            }
        });
    }

    /**
     *
     * @param layer
     * @returns {boolean}
     */
    raiseToTop(layer) {
        if (layer.top == true && this.getImageryLayers().contains(layer.imagery)) {
            this.getImageryLayers().raiseToTop(layer.imagery);
            return true;
        }
        return false;
    }
}