/**
 * @class EarthTrekHandler
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 02 JUN 2017
 */

import Cesium from './utils/cesium';
import ScreenSpaceEventHandler from 'cesium/Source/Core/ScreenSpaceEventHandler';
import ScreenSpaceEventType from 'cesium/Source/Core/ScreenSpaceEventType';

class EarthTrekHandler {
    /**
     * Constructor
     * @param viewer
     * @param options
     */
    constructor (viewer, options) {
        this.viewer = viewer;
        this.handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
        this.pickedEntity = null;
    }

    /**
     * Handler On Left Click
     * @param defaultCallback
     * @param callbackPicked
     * @param callbackUnpick
     */
    onLeftClick (defaultCallback, callbackPicked, callbackUnpick) {
        this.handler.setInputAction((movement) => {
            var pick = this.viewer.scene.pick(movement.position);
            if (this.pickedEntity != undefined) {
                defaultCallback(this.pickedEntity)
                this.pickedEntity = undefined;
            }
            if (Cesium.defined(pick)) {
                var entity = this.viewer.entities.getById(pick.id._id);
                if (entity != undefined) {
                    callbackPicked(entity);
                    this.pickedEntity = entity;
                }
            } else {
                callbackUnpick();
            }
        }, ScreenSpaceEventType.LEFT_CLICK);
    }

    /**
     * Handler On Mouse Move
     * @param callbackPicked
     * @param callbackUnpick
     */
    onMouseMove (callbackPicked, callbackUnpick) {
        this.handler.setInputAction((movement) => {
            var pick = this.viewer.scene.pick(movement.endPosition);
            if (Cesium.defined(pick)) {
                var entity = this.viewer.entities.getById(pick.id._id);
                if (entity != undefined) {
                    this.mouseOverEntity = entity;
                    callbackPicked(entity);
                }
            } else if (this.mouseOverEntity != null) {
                this.viewer.entities.values.forEach( (entity) => {
                    if (this.pickedEntity != entity) {
                        callbackUnpick(entity);
                    }
                });
                this.mouseOverEntity = null;
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    }
}
module.exports = EarthTrekHandler;