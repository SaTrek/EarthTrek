/**
 * @class EarthTrekLayers
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 2017-05-25
 */
var earthTrekLayer = earthTrekLayer || {};

earthTrekLayer.setViewer = function(viewer) {
    this.layerViewer = viewer;
}

earthTrekLayer.addLayer = function(layer) {

}

earthTrekLayer.getLayers = function() {
    return this.layerViewer.scene.imageryLayers;
}

earthTrekLayer.toggleLayer = function() {
}

earthTrekLayer.removeLayer = function(layer) {
    var imageryLayers = earthTrekLayer.getLayers();
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

module.exports = earthTrekLayer;