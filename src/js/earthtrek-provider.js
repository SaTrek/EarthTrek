/**
 * @class GIBS Provider
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 01 MAY 2017.
 */

var provider = provider || {};
var WebMapTileServiceImageryProvider = require('cesium/Source/Scene/WebMapTileServiceImageryProvider');
var gibs = require('./utils/tilling-scheme');

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
    var provider = new WebMapTileServiceImageryProvider({
        url: "https://gibs-c.earthdata.nasa.gov/wmts/" + options.tileMatrixSetID + "/best/wmts.cgi?time=" + options.time,
        layer: options.id,
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
module.exports = provider;