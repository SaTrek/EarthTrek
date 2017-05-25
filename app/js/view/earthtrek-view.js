/**
 * @class SatellitePanelView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 MAY 2017.
 */
//require("amd-loader");
define([
    'jquery',
    'bootstrap'
], function () {

    function EarthTrekView(viewer, options) {
        this.viewer = viewer;
    }

    return SatellitePanelView;
});