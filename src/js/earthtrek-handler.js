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
    constructor (earthTrek, options) {
        this.earthTrek = earthTrek;
        this.viewer = earthTrek.getViewer();
        this.scene = earthTrek.getViewer().scene;
        this.handler = new ScreenSpaceEventHandler(this.scene.canvas);
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
            let pick = this.scene.pick(movement.position);
            if (this.pickedEntity != undefined) {
                defaultCallback(this.pickedEntity);
                this.pickedEntity = undefined;
            }
            if (Cesium.defined(pick)) {
                let entity = this.viewer.entities.getById(pick.id._id);
                if (entity != undefined) {
                    callbackPicked(entity);
                    this.earthTrek.getEventEmitter().emit('entity-picked', {entity: entity});
                    this.pickedEntity = entity;
                }
            } else {
                this.earthTrek.getEventEmitter().emit('entity-unpicked', {entity: this.pickedEntity});
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
            let pick = this.scene.pick(movement.endPosition);
            if (Cesium.defined(pick)) {
                let entity = this.viewer.entities.getById(pick.id._id);
                if (entity != undefined) {
                    this.earthTrek.getEventEmitter().emit('entity-over', {entity: entity});
                    this.mouseOverEntity = entity;
                    callbackPicked(entity);
                }
            } else if (this.mouseOverEntity != null) {
                this.viewer.entities.values.forEach( (entity) => {
                    if (this.pickedEntity != entity) {
                        this.earthTrek.getEventEmitter().emit('entity-out', {entity: entity});
                        callbackUnpick(entity);
                    }
                });
                this.mouseOverEntity = null;
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    }
}
module.exports = EarthTrekHandler;