'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @class EarthTrekHandler
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module EarthTrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author SATrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @description EarthTrek - NASA Space Apps 2017 - 02 JUN 2017
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _cesium = require('./utils/cesium');

var _cesium2 = _interopRequireDefault(_cesium);

var _ScreenSpaceEventHandler = require('cesium/Source/Core/ScreenSpaceEventHandler');

var _ScreenSpaceEventHandler2 = _interopRequireDefault(_ScreenSpaceEventHandler);

var _ScreenSpaceEventType = require('cesium/Source/Core/ScreenSpaceEventType');

var _ScreenSpaceEventType2 = _interopRequireDefault(_ScreenSpaceEventType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EarthTrekHandler = function () {
    /**
     * Constructor
     * @param viewer
     * @param options
     */
    function EarthTrekHandler(earthTrek, options) {
        _classCallCheck(this, EarthTrekHandler);

        this.earthTrek = earthTrek;
        this.viewer = earthTrek.getViewer();
        this.scene = earthTrek.getViewer().scene;
        this.handler = new _ScreenSpaceEventHandler2.default(this.scene.canvas);
        this.pickedEntity = null;
    }

    /**
     * Handler On Left Click
     * @param defaultCallback
     * @param callbackPicked
     * @param callbackUnpick
     */


    _createClass(EarthTrekHandler, [{
        key: 'onLeftClick',
        value: function onLeftClick(defaultCallback, callbackPicked, callbackUnpick) {
            var _this = this;

            this.handler.setInputAction(function (movement) {
                var pick = _this.scene.pick(movement.position);
                if (_this.pickedEntity != undefined) {
                    defaultCallback(_this.pickedEntity);
                    _this.pickedEntity = undefined;
                }
                if (_cesium2.default.defined(pick)) {
                    var entity = _this.viewer.entities.getById(pick.id._id);
                    if (entity != undefined) {
                        callbackPicked(entity);
                        _this.earthTrek.getEventEmitter().emit('entity-picked', { entity: entity });
                        _this.pickedEntity = entity;
                    }
                } else {
                    _this.earthTrek.getEventEmitter().emit('entity-unpicked', { entity: _this.pickedEntity });
                    callbackUnpick();
                }
            }, _ScreenSpaceEventType2.default.LEFT_CLICK);
        }

        /**
         * Handler On Mouse Move
         * @param callbackPicked
         * @param callbackUnpick
         */

    }, {
        key: 'onMouseMove',
        value: function onMouseMove(callbackPicked, callbackUnpick) {
            var _this2 = this;

            this.handler.setInputAction(function (movement) {
                var pick = _this2.scene.pick(movement.endPosition);
                if (_cesium2.default.defined(pick)) {
                    var entity = _this2.viewer.entities.getById(pick.id._id);
                    if (entity != undefined) {
                        _this2.earthTrek.getEventEmitter().emit('entity-over', { entity: entity });
                        _this2.mouseOverEntity = entity;
                        callbackPicked(entity);
                    }
                } else if (_this2.mouseOverEntity != null) {
                    _this2.viewer.entities.values.forEach(function (entity) {
                        if (_this2.pickedEntity != entity) {
                            _this2.earthTrek.getEventEmitter().emit('entity-out', { entity: entity });
                            callbackUnpick(entity);
                        }
                    });
                    _this2.mouseOverEntity = null;
                }
            }, _ScreenSpaceEventType2.default.MOUSE_MOVE);
        }
    }]);

    return EarthTrekHandler;
}();

module.exports = EarthTrekHandler;