/**
 * @class Satellite Propagation
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */
var earthTrekToolbar = earthTrekToolbar || {};

earthTrekToolbar.create = function(id, callback) {
    var toolbar = document.createElement('div');
    $(toolbar).attr('id', id);
    $(toolbar).addClass('earthtrek-toolbar');
    callback(toolbar);
    return toolbar;
}
