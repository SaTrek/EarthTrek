/**
 * @class EarthTrekCompare
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 28 APR 2017.
 */
var moment = require('moment');
var ImageryLayer = require('cesium/Source/Scene/ImageryLayer');
var ImagerySplitDirection = require('cesium/Source/Scene/ImagerySplitDirection');
var datepicker = require('bootstrap-datepicker');
var earthTrekLayer = require('./earthtrek-layer');

var earthTrekUtils = require('./utils/earthtrek-utils');

require('../css/compare.css');
'use strict';

/**
 *
 * @param viewer
 * @constructor
 */
function EarthTrekCompare(viewer) {
    this.viewer = viewer;
}

/**
 *
 * @param layer
 */
EarthTrekCompare.prototype.showCompare = function (layer) {
    var that = this;
    var today = earthTrekUtils.isoDate(that.viewer.clock.currentTime.toString());

    $('#compare-layer-name').html(layer.title);

    var compareButton = '#remove-comparation';
    $(compareButton).click(function() {
        that.remove();
    });

    var endDate = (layer.endDate != null) ? layer.endDate : today;

    $('.datepicker').datepicker({
        autoclose: true,
        todayHighlight: true,
        startView: 2,
        orientation: 'bottom'
    }).on('changeDate', function(e) {
        that.onCompare(layer);
        $(compareButton).removeAttr('disabled');
    });;

    $('.datepicker').datepicker('setStartDate', layer.startDate);
    $('.datepicker').datepicker('setEndDate', endDate);

    $('#compare-modal').show();
    $('#compare-date').datepicker('show');

    $("#accept-date").click(function () {
        if ($('#compare-date').val()) {
            that.onCompare(layer);
            $(compareButton).removeAttr('disabled');
        }
    });
}

EarthTrekCompare.prototype.onCompare = function (layer) {
    var that = this;
    var today = earthTrekUtils.isoDate(that.viewer.clock.currentTime.toString());
    layer.id = layer.id;
    layer.firstDate = $('#compare-date').val();
    layer.secondDate = today;
    layer.format = layer.format;
    layer.resolution = layer.resolution;
    that.compare(layer);
}


/**
 * Compare layer through time
 * @param layer
 */
EarthTrekCompare.prototype.compare = function (layer) {
    var that = this;

    if (!$("#slider").is(':visible')) {
        $("#slider").show();
    }
    if (this.firstView != undefined) {
        earthTrekLayer.removeLayer(that.firstView);
    }
    if (this.secondView != undefined) {
        earthTrekLayer.removeLayer(that.secondView);
    }
    this.firstView = earthTrekLayer.addLayer(layer.firstDate, layer, true);
    this.secondView = earthTrekLayer.addLayer(layer.secondDate, layer, true);
    this.secondView.splitDirection = ImagerySplitDirection.RIGHT;

    var slider = document.getElementById('slider');
    this.viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

    var firstDate = document.createElement('div');
    $(firstDate).addClass('earthtrek-panel first-date-compare');
    $(firstDate).html(moment(layer.firstDate).format('DD MMM Y'));
    $('#main-container').append(firstDate);
    $(firstDate).show();

    var secondDate = document.createElement('div');
    $(secondDate).addClass('earthtrek-panel second-date-compare');
    $(secondDate).html(moment(layer.secondDate).format('DD MMM Y'));
    $('#main-container').append(secondDate);
    $(secondDate).show();


    /**
     * REFACTOR
     */
    var dragStartX = 0;

    document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', sliderMove, true);
    }

    function mouseDown(e) {
        var slider = document.getElementById('slider');
        dragStartX = e.clientX - slider.offsetLeft;
        window.addEventListener('mousemove', sliderMove, true);
    }

    function sliderMove(e) {
        var slider = document.getElementById('slider');
        var splitPosition = (e.clientX - dragStartX) / slider.parentElement.offsetWidth;
        slider.style.left = 100.0 * splitPosition + "%";
        $(firstDate).css('left', (100.0 * (splitPosition - 0.047)) + "%");
        $(secondDate).css('left', 100.0 * (splitPosition) + "%");
        that.viewer.scene.imagerySplitPosition = splitPosition;
    }

}

/**
 * Remove Compare
 */
EarthTrekCompare.prototype.remove = function () {
    if ($("#slider").is(':visible')) {
        $("#slider").hide();
        $('.first-date-compare').remove();
        $('.second-date-compare').remove();
    }
    earthTrekLayer.removeLayer(this.firstView);
    this.secondView.splitDirection =  ImageryLayer.DEFAULT_SPLIT;
    $('#compare-modal').hide();
}

module.exports = EarthTrekCompare;