/**
 * @class Main
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */
define([
    'EarthTrek',
    'jquery'
], function(EarthTrek, $) {
    var maxDistanceCamera = 10000000000;
    var earthTrek = new EarthTrek(Date.UTC(1998, 1, 1), Date.now(), Date.now());
    earthTrek.createViewer('main-container', maxDistanceCamera);

    $.getJSON( "data/instrumentsFULL.json", function( satellites ) {
        earthTrek.createEntities(satellites);
    });
    //var satelliteView = new SatelliteView();
        // $(toolbarContainer).append(satelliteContainer);
        //  this.createEntities(satelliteView.addSatelliteToToolbar);
});