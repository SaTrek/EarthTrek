/**
 * @class GIBS Provider
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 01 MAY 2017.
 */

var provider = provider || {};

provider.getProvider = function(layer, time, format, tileMatrixSetID, resolution) {
    var isoTime = "TIME=" + isoDate(time);
    var provider = new Cesium.WebMapTileServiceImageryProvider({
        url: "//gibs-c.earthdata.nasa.gov/wmts/" + tileMatrixSetID + "/best/wmts.cgi?" + isoTime,
        layer: layer,
        style: "",
        format: format,
        tileMatrixSetID: tileMatrixSetID.toUpperCase() + "_" + resolution,
        maximumLevel: 8,
        tileWidth: 256,
        tileHeight: 256,
        tilingScheme: gibs.GeographicTilingScheme()
    });
    return provider;
}
