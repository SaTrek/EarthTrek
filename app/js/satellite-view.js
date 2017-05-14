/**
 * @class SatelliteView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 APR 2017.
 */
require("amd-loader");
define([
], function() {


    function SatelliteView () {

    }

    SatelliteView.prototype.createSatellite = function (sat) {
        var satelliteContainer = document.createElement('div');

        var satelliteImage = document.createElement('img');
        $(satelliteImage).attr("src", 'images/satellites/' + sat.image)
        $(satelliteContainer).append(satelliteImage);
        $(satelliteContainer).click(function() {
            var selected = gotoSatellite(viewer.entities.getById(sat.id.toLowerCase()));
            if (selected == true) {
                $(".satellite-selected").removeClass("satellite-selected");
                $(satelliteContainer).addClass("satellite-selected");
            }
        });
        $(satelliteContainer).popover({
            trigger: 'hover',
            title: sat.name,
            content: sat.description,
            placement: 'bottom',
            container: "#left-toolbar"
        });
        return satelliteContainer;
    }

    return SatelliteView;
    module.exports = SatelliteView;
});