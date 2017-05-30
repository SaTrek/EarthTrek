/**
 * @class GIBS Provider
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 01 MAY 2017.
 */

var provider = provider || {};
define([
    'cesium',
    'tilling-scheme'
], function() {

    provider.getProvider = function(options) {
        if (!options.layer) {

        }
        if (!options.time) {

        }
        if (!options.format) {
         //   layer, time, format, tileMatrixSetID, resolution, maxLevel
        }
        if (!options.tileMatrixSetID) {
            //   layer, time, format, tileMatrixSetID, resolution, maxLevel
        }
        var provider = new Cesium.WebMapTileServiceImageryProvider({
            url: "//gibs-c.earthdata.nasa.gov/wmts/" + options.tileMatrixSetID + "/best/wmts.cgi?time=" + options.time,
            layer: options.layer,
            style: "",
            format: options.format,
            tileMatrixSetID: options.tileMatrixSetID.toUpperCase() + "_" + options.resolution,
            maximumLevel: options.maximumLevel,
            tileWidth: 256,
            tileHeight: 256,
            tilingScheme: gibs.GeographicTilingScheme()
        });
        return provider;
    }
});