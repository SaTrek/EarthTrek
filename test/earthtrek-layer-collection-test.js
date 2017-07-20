/**
 * @class EarthTrekLayerCollectionTest
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrekCore - 08 JUL 2017.
 */
import EarthTrekLayerCollection from '../src/js/earthtrek-layer-collection';
import sinon from 'sinon';
import { assert } from 'chai';
import {ImageryLayerCollection} from '../src/js/engines/cesium';

describe('EarthTrekLayerCollection',  () => {

    var layerWithImagery, collection, layer, noRemovablelayer, removablelayer;

    before(() => {
       noRemovablelayer = {
           id: "Reference_Features",
           format: "image/png",
           resolution: '250m',
           top: true,
           maximumLevel: 9,
           removable: false
       };

        removablelayer = {
            id: "Reference_Labels",
            format: "image/png",
            resolution: '250m',
            top: true,
            maximumLevel: 9
        };
    });

    beforeEach(() => {
        collection = new EarthTrekLayerCollection();
        sinon.stub(collection, 'getInstance').withArgs().returns({raise: function () {
            
        }});
        sinon.stub(collection, "getImageryLayers").withArgs().returns(new ImageryLayerCollection());
        layerWithImagery = collection.add(removablelayer);
    });

    it('Add layer to collection', (done) => {
        assert.equal(layerWithImagery.id, layerWithImagery.imagery._imageryProvider._layer);
        done();
    });

    it('Remove layer from collection', (done) => {
        //Try to remove
        assert.equal(1, collection.length());
        assert.isTrue(collection.remove(removablelayer));
        assert.equal(0, collection.length());

        //If the result is true, then try to remove again the same layer.
        assert.isFalse(collection.remove(removablelayer));
        //The result should by false
        done();
    });

    it('Try to remove non removable layer from collection', (done) => {
        collection.add(noRemovablelayer);
        assert.isFalse(collection.remove(noRemovablelayer));
        done();
    });

    it('Hide layer from collection', (done) => {
        assert.isTrue(collection.hide(layerWithImagery));
        done();
    });

    it('Toggle Layer visibility', (done) => {
        //Hide Layer
        assert.isFalse(collection.toggle(layerWithImagery));
        //Show Layer
        assert.isTrue(collection.toggle(layerWithImagery));
        done();
    });

    it('Toggle Layer visibility with callback', (done) => {
        //Hide Layer
        assert.isFalse(collection.toggle(layerWithImagery), (show) => {
            return show;
        });
        //Show Layer
        assert.isTrue(collection.toggle(layerWithImagery), (show) => {
            return show;
        });
        done();
    });

    it('Raise to top layer in collection', (done) => {
        assert.isTrue(collection.raiseToTop(layerWithImagery));
        done();
    });
});