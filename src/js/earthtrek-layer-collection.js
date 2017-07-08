/**
 * @class EarthTrekLayerCollection
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrekCore - 08 JUL 2017.
 */

export default class EarthTrekLayerCollection
{
    constructor() {
        this.layers = new Map();
    }

    add(layer) {
        let maximumLevel = (layer.format == 'image/png') ? 2 : 8;
        if (layer.maximumLevel) {
            maximumLevel = layer.maximumLevel;
        }

        /*
        const newLayerProvider = earthTrekProvider.getProvider({
            layer: layer.id,
            time: layer.time,
            format: layer.format,
            tileMatrixSetID: "epsg4326",
            resolution: layer.resolution,
            maximumLevel: maximumLevel
        });*/

    }
}