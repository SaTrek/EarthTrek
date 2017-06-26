'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @class EarthTrekLayer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module EarthTrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author SATrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @description EarthTrek - NASA Space Apps 2017 - 25 MAY 2017
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _ImageryLayer = require('cesium/Source/Scene/ImageryLayer');

var _ImageryLayer2 = _interopRequireDefault(_ImageryLayer);

var _earthtrekProvider = require('./earthtrek-provider');

var _earthtrekProvider2 = _interopRequireDefault(_earthtrekProvider);

var _earthtrekCore = require('./earthtrek-core');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var earthTrekLayer = function () {
    function earthTrekLayer() {
        _classCallCheck(this, earthTrekLayer);
    }

    _createClass(earthTrekLayer, null, [{
        key: 'addLayer',
        value: function addLayer(today, layer, dontHide) {
            if (dontHide === undefined) {
                earthTrekLayer.hideLayer(layer);
            }

            var maximumLevel = layer.format == 'image/png' ? 2 : 8;
            if (layer.maximumLevel) {
                maximumLevel = layer.maximumLevel;
            }
            var newLayerProvider = _earthtrekProvider2.default.getProvider({
                layer: layer.id,
                time: today,
                format: layer.format,
                tileMatrixSetID: "epsg4326",
                resolution: layer.resolution,
                maximumLevel: maximumLevel
            });

            if ((0, _earthtrekCore.earthTrekInstance)().getViewer().scene.imageryLayers._layers[0].format == 'image/jpeg') {
                (0, _earthtrekCore.earthTrekInstance)().getViewer().scene.imageryLayers._layers[0].show = false;
                //    that.viewer.scene.imageryLayers.lowerToBottom(that.viewer.scene.imageryLayers._layers[0].show = false);
            }
            var addedLayer = (0, _earthtrekCore.earthTrekInstance)().getViewer().scene.imageryLayers.addImageryProvider(newLayerProvider);

            var layers = (0, _earthtrekCore.earthTrekInstance)().getLayers();
            layers.push({ layer: layer, cesiumLayer: addedLayer });
            layers.forEach(function (objLayer) {
                if (objLayer.layer.top != undefined && objLayer.layer.top == true) {
                    (0, _earthtrekCore.earthTrekInstance)().getViewer().scene.imageryLayers.raiseToTop(objLayer.cesiumLayer);
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

    }, {
        key: 'getImageryLayers',
        value: function getImageryLayers() {
            return (0, _earthtrekCore.earthTrekInstance)().getViewer().scene.imageryLayers;
        }

        /**
         * Remove Layer
         * @param object layer
         * @returns {boolean}
         */

    }, {
        key: 'removeLayer',
        value: function removeLayer(layer) {
            var imageryLayers = earthTrekLayer.getImageryLayers();
            if (layer instanceof _ImageryLayer2.default) {
                imageryLayers.remove(layer);
                return true;
            }
            for (var i = 0; i <= imageryLayers.length - 1; i++) {
                var imageryLayer = imageryLayers.get(i);
                if (imageryLayer.imageryProvider._layer == layer.id) {
                    imageryLayers.remove(imageryLayer);
                    return true;
                }
            }
            return false;
        }

        /**
         * Hide Layer
         * @param object layer
         */

    }, {
        key: 'hideLayer',
        value: function hideLayer(layer) {
            var imageryLayers = earthTrekLayer.getImageryLayers();
            for (var i = 0; i <= imageryLayers.length - 1; i++) {
                var imageryLayer = imageryLayers.get(i);
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

    }, {
        key: 'toggleLayerById',
        value: function toggleLayerById(layerId, callback) {
            var imageryLayers = earthTrekLayer.getImageryLayers();
            for (var i = 0; i <= imageryLayers.length - 1; i++) {
                var imageryLayer = imageryLayers.get(i);
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

    }, {
        key: 'raiseToTop',
        value: function raiseToTop(plainLayer, layer) {
            if (plainLayer.top != undefined && plainLayer.top == true) {
                (0, _earthtrekCore.earthTrekInstance)().getViewer().scene.imageryLayers.raiseToTop(layer);
            }
        }
    }]);

    return earthTrekLayer;
}();

module.exports = earthTrekLayer;