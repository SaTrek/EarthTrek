'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @class EarthTrekRightToolbar
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @module EarthTrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author SATrek
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @description EarthTrek - 23 JUN 2017.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */

var _earthtrekLayer = require('../earthtrek-layer');

var _earthtrekLayer2 = _interopRequireDefault(_earthtrekLayer);

var _earthtrekUtils = require('../utils/earthtrek-utils');

var _earthtrekUtils2 = _interopRequireDefault(_earthtrekUtils);

require('../../css/right-toolbar.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EarthTrekRightToolbar = function () {
    function EarthTrekRightToolbar() {
        _classCallCheck(this, EarthTrekRightToolbar);
    }

    _createClass(EarthTrekRightToolbar, null, [{
        key: 'add',


        /**
         * Add Icon to the right toolbar
         * @param className
         * @param selected
         */
        value: function add(className, selected, callback) {
            var iconButton = document.createElement('button');
            /* $(iconButton).append('<i class="fa fa-tag" aria-hidden="true"></i>');*/
            $(iconButton).addClass('cesium-toolbar-button cesium-button');
            $(iconButton).addClass(className);
            if (selected == true) {
                $(iconButton).addClass('selected');
            }
            if (callback != undefined) {
                $(iconButton).click(function (e) {
                    callback(iconButton);
                });
            }
            $('.cesium-viewer-toolbar')[0].append(iconButton);
        }

        /**
         * Add Layer
         * @param layer
         * @param className
         * @param selected
         */

    }, {
        key: 'addToogleLayer',
        value: function addToogleLayer(layer, className, selected) {
            _earthtrekLayer2.default.addLayer(_earthtrekUtils2.default.getCurrentIsoDate(), layer);
            EarthTrekRightToolbar.add(className, selected, function (iconButton) {
                _earthtrekLayer2.default.toggleLayerById(layer.id, function (show) {
                    if (show == true) {
                        $(iconButton).addClass('selected');
                    } else {
                        $(iconButton).removeClass('selected');
                    }
                });
            });
        }
    }]);

    return EarthTrekRightToolbar;
}();

module.exports = EarthTrekRightToolbar;