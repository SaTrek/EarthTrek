/**
 * @class EarthTrekLayerCollectionTest
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrekCore - 08 JUL 2017.
 */


import EarthTrekLayerCollection from '../src/js/earthtrek-layer-collection';
import EarthTrekLayer from '../src/js/earthtrek-layer';

describe('EarthTrekLayerCollection', function(){


    it('Add layer to collection', ()  => {
        let collection = new EarthTrekLayerCollection();
        collection.add(new EarthTrekLayer());
    });
});