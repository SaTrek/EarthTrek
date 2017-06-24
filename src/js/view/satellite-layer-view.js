/**
 * @class SatelliteLayerView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 MAY 2017.
 */
var earthTrekUtils = require('../utils/earthtrek-utils');
var Cesium = require('../utils/cesium');
var $ = require('jquery');
var moment = require('moment');
var bootstrap = require('bootstrap');
var JulianDate = require('cesium/Source/Core/JulianDate');

var provider = require('../earthtrek-provider');
var earthTrekLayer = require('../earthtrek-layer');

require('bootstrap/dist/css/bootstrap.min.css');
require('bootstrap-datepicker/dist/css/bootstrap-datepicker.min.css');

function SatelliteLayerView(viewer, options) {
    this.viewer = viewer;

}

/**
 *
 * @param event
 * @returns {boolean}
 */
SatelliteLayerView.prototype.updateLayers = function (event, today) {
    var entity = event.data.entity;
    if ($('.selected-instrument').length == 0) {
        return false;
    }
    var selectedInstrument = $($('.selected-instrument')[0].parentElement).data('instrument');

    $.each(entity.properties.instruments.getValue(), function(key, instrument) {
        if (instrument.name == selectedInstrument) {
            $.each(instrument.layers, function(key, layer) {
                if (layer.endDate == null) {
                    var present = new Date();
                    layer.endDate = present.toISOString().split("T")[0]
                }
                if (layer.startDate <= today && layer.endDate >= today) {
                    $('#layer-view-' + layer.id).removeAttr('disabled');
                    $('#layer-compare-' + layer.id).removeAttr('disabled');
                } else {
                    $('#layer-view-' + layer.id).attr('disabled', 'disabled');
                    $('#layer-compare-' + layer.id).attr('disabled', 'disabled');
                }
            });
        }
    });
}

/**
 *
 * @param event
 */
SatelliteLayerView.prototype.showLayers = function (event) {
    var entity = event.data.entity;
    var panel = event.data.panel;
    $('.satellite-instrument .selected-instrument').removeClass('selected-instrument');
    $(this).addClass("selected-instrument");
    $("#satellite-instrument-layers").empty();
    $.each(entity.properties.instruments.getValue(), function(key, instrument) {
        if (instrument.name == event.data.instrument.name) {
            $.each(instrument.layers, function(key, layer) {
                var instrumentLayer = panel.createLayer(layer);
                $("#satellite-instrument-layers").append(instrumentLayer).show();
            });
        }
    });
}
/**
 *
 * @param layer
 * @returns {Element}
 */
SatelliteLayerView.prototype.createLayer = function(layer) {
    var instrumentLayer = document.createElement('div');
    $(instrumentLayer).addClass("instrument-layer");
    $(instrumentLayer).data("id", layer.id);
    $(instrumentLayer).data("startDate", layer.startDate);
    $(instrumentLayer).data("format", layer.format);
    $(instrumentLayer).data("resolution", layer.resolution);
    $(instrumentLayer).html("<div>" + layer.title + "</div>");

    $(instrumentLayer).append(this.addAvailabilityButtons(layer));

    var instrumentButtons = document.createElement("div");
    $(instrumentButtons).addClass('fixed-buttons');
    $(instrumentLayer).append(instrumentButtons);

    $(instrumentButtons).append(this.addToggleLayerButton(layer));
    $(instrumentButtons).append(this.addCompareButton(layer));

    return instrumentLayer;
}


/**
 *
 * @param layer
 * @returns {Element}
 */
SatelliteLayerView.prototype.addAvailabilityButtons = function(layer) {

    var that = this;
    var endDate = (layer.endDate == null) ? 'Present' : moment(layer.endDate).format('DD MMM Y');

    var startDateButton = document.createElement('button');
    $(startDateButton).html(moment(layer.startDate).format('DD MMM Y'));
    $(startDateButton).click(function() {
        that.viewer.clock.currentTime = JulianDate.fromDate(new Date(layer.startDate));
    });
    var endDateButton = document.createElement('button');
    $(endDateButton).html(endDate);
    $(endDateButton).click(function() {
        var endDateObj = new Date(layer.endDate);
        if (layer.endDate == null) {
            endDateObj = new Date();
        }
        that.viewer.clock.currentTime = JulianDate.fromDate(endDateObj);
    });

    var layerAvailable = document.createElement('div');
    $(layerAvailable).addClass("layer-available");
    $(layerAvailable).html('<span>Available:</span>');
    $(layerAvailable).append(startDateButton);
    $(layerAvailable).append(' - ');
    $(layerAvailable).append(endDateButton);
    return layerAvailable;
}

/**
 *
 * @param layer
 * @returns {Element}
 */
SatelliteLayerView.prototype.addToggleLayerButton = function(layer) {
    var that = this;
    var today = earthTrekUtils.isoDate(that.viewer.clock.currentTime.toString());
    var objToday = new Date(today);
    objToday.setDate(objToday.getDate());
    var toggleLayerButton = document.createElement("button");
    $(toggleLayerButton).attr('id', 'layer-view-' + layer.id);
    $(toggleLayerButton).on('click', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            earthTrekLayer.removeLayer(layer);
        } else {
            $(this).addClass('selected');
            earthTrekLayer.addLayer(earthTrekUtils.isoDate(that.viewer.clock.currentTime.toString()), layer);
        }

    });

    $(toggleLayerButton).addClass("view");
    if (layer.endDate < today || layer.startDate > today) {
        $(toggleLayerButton).attr('disabled', 'disabled');
    }
    return toggleLayerButton;
};

/**
 * Add Compare Button
 * @param instrumentButtons
 */
SatelliteLayerView.prototype.addCompareButton = function(layer) {
    var that = this;
    var today = earthTrekUtils.isoDate(that.viewer.clock.currentTime.toString());
    var compareButton = document.createElement("button");
    $(compareButton).attr('id', 'layer-compare-' + layer.id);
    $(compareButton).click(function () {
        var button = $(this);
        that.earthTrekCompare.showCompare(layer, function() {
            if (button.hasClass('selected')) {
                button.removeClass('selected');
            } else {
                button.addClass('selected');
            }
        });
    });
    $(compareButton).addClass("compare");
    if (layer.endDate < today || layer.startDate > today) {
        $(compareButton).attr('disabled', 'disabled');
    }
    return compareButton;
};

module.exports = SatelliteLayerView;