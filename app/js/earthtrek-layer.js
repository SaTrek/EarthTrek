/**
 * @class EarthTrekLayers
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 APR 2017.
 */
var earthTrekLayer = earthTrekLayer || {};
define([
], function() {

    var stackLayers = [];

    earthTrekLayer.addLayer = function(layer) {
        stackLayers.push(layer);
    }

    earthTrekLayer.getLayers = function() {
        return stackLayers;
    }
});