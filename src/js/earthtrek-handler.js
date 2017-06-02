/**
 * @class EarthTrekHandlers
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 02 JUN 2017
 */

var ScreenSpaceEventHandler = require('cesium/Source/Core/ScreenSpaceEventHandler');
var ScreenSpaceEventType = require('cesium/Source/Core/ScreenSpaceEventType');

function EarthTrekHandler(viewer, options) {
    this.viewer = viewer;
    this.handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
    this.pickedEntity = null;
}

/**
 *
 */
EarthTrekHandler.prototype.onLeftClick = function(defaultCallback, callbackPicked, callbackUnpick) {
    var that = this;
    this.handler.setInputAction(function (movement) {
        var pick = that.viewer.scene.pick(movement.position);
        if (that.pickedEntity != undefined) {
            defaultCallback(that.pickedEntity)
            that.pickedEntity = undefined;
        }
        if (Cesium.defined(pick)) {
            var entity = that.viewer.entities.getById(pick.id._id);
            if (entity != undefined) {
                callbackPicked(entity);
                /*that.setGlowPath(entity);
                satellitePanel.show(entity);
                that.evt.raiseEvent(entity);*/
                that.pickedEntity = entity;
            }
        } else {
            callbackUnpick();
           // satellitePanel.hide();
          //  that.viewer.trackedEntity = undefined;
        }
    }, ScreenSpaceEventType.LEFT_CLICK);
}

/**
 *
 */
/*EarthTrekHandler.prototype.onMouseMove = function() {
    this.handler.setInputAction(function (movement) {
        var pick = that.viewer.scene.pick(movement.endPosition);
        if (Cesium.defined(pick)) {
            var entity = that.viewer.entities.getById(pick.id._id);
            if (entity != undefined) {
                that.mouseOverEntity = entity;
                that.setGlowPath(entity);
            }
        } else if (that.mouseOverEntity != null) {
            that.viewer.entities.values.forEach(function (entity) {
                if (this.pickedEntity != entity) {
                    that.setDefaultPath(entity);
                }
            });
            that.mouseOverEntity = null;
        }
    }, ScreenSpaceEventType.MOUSE_MOVE);
}
*/
module.exports = EarthTrekHandler;