/**
 * @class SatellitePanelView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 APR 2017.
 */
//require("amd-loader");
define([
    'jquery',
    'bootstrap',
    'slick'
], function () {

    function SatellitePanelView(viewer, containerId) {
        this.viewer = viewer;
        this.mainContainerId = this.viewer.container.id;
        this.satellitePanel = $('#' + containerId);
        this.instrumentsContainer = $("#satellite-instruments");
    }

    SatellitePanelView.prototype.show = function (entity) {
        this.instrumentsContainer.empty();
        if (entity.properties == undefined) {
            this.satellitePanel.hide();
            return false;
        }

        $('#satellite-name').html(entity.properties.name.getValue());

        if (entity.properties.instruments !== undefined) {
            this.addInstruments(entity)
        }
        this.satellitePanel.show();
    }

    SatellitePanelView.prototype.hide = function () {
        this.satellitePanel.hide();
    }

    SatellitePanelView.prototype.addInstruments = function (entity) {
        var that = this;
        var instruments = entity.properties.instruments.getValue();
        if (instruments.length == 0) {
            return false;
        }
        instruments.forEach(function(instrument) {
            var instrumentElement = document.createElement('div');
            $(instrumentElement).id = "satellite-instrument-" + entity.id + "-" + instrument.name;
            $(instrumentElement).addClass("satellite-instrument");
            $(instrumentElement).html("<div>" + instrument.name + "</div>");
            $(instrumentElement).data('instrument', instrument.name);

            var layerButton = document.createElement("button");
          //  $(layerButton).click(showLayers);
            $(instrumentElement).append(layerButton);

            that.instrumentsContainer.append(instrumentElement);
        });
    }

    SatellitePanelView.prototype.render = function () {

    }

    return SatellitePanelView;
});