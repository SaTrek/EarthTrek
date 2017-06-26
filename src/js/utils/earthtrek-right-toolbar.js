/**
 * @class EarthTrekRightToolbar
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - 23 JUN 2017.
 */

import earthTrekLayer from '../earthtrek-layer';
import earthTrekUtils from '../utils/earthtrek-utils';

import '../../css/right-toolbar.css';

class EarthTrekRightToolbar {


    /**
     * Add Icon to the right toolbar
     * @param className
     * @param selected
     */
    static add(className, selected, callback) {
        const iconButton = document.createElement('button');
        /* $(iconButton).append('<i class="fa fa-tag" aria-hidden="true"></i>');*/
        $(iconButton).addClass('cesium-toolbar-button cesium-button');
        $(iconButton).addClass(className);
        if (selected == true) {
            $(iconButton).addClass('selected');
        }
        if (callback != undefined) {
            $(iconButton).click((e) => {
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
    static addToogleLayer(layer, className, selected) {
        earthTrekLayer.addLayer(earthTrekUtils.getCurrentIsoDate(), layer);
        EarthTrekRightToolbar.add(
            className,
            selected,
            (iconButton) => {
                earthTrekLayer.toggleLayerById(layer.id, (show) => {
                    if (show == true) {
                        $(iconButton).addClass('selected');
                    } else {
                        $(iconButton).removeClass('selected');
                    }
                });
            }
        );
    }
}

module.exports = EarthTrekRightToolbar;