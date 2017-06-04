/**
 * @class EarthTrekCompare
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 28 APR 2017.
 */

define([
    'cesium',
    'earthtrek-layer'
], function () {
    'use strict';

    function EarthTrekCompare(viewer) {
        this.viewer = viewer;
    }

    EarthTrekCompare.prototype.remove = function () {
        earthTrekLayer.removeLayer(that.firstView);
        that.secondView.splitDirection =  Cesium.ImageryLayer.DEFAULT_SPLIT;
    }

    EarthTrekCompare.prototype.compare = function (layer) {
        var that = this;

        if (!$("#slider").is(':visible')) {
            $("#slider").show();
            var compareButton = document.createElement('button');
            $(compareButton).html('Remove comparation');
            $(compareButton).click(function() {

            });
            $('#main-container').append(compareButton);
        }
        if (that.firstView != undefined) {
            earthTrekLayer.removeLayer(that.firstView);
        }
        if (that.secondView != undefined) {
            earthTrekLayer.removeLayer(that.secondView);
        }
        that.firstView = earthTrekLayer.addLayer(layer.firstDate, layer, true);
        that.secondView = earthTrekLayer.addLayer(layer.secondDate, layer, true);
        that.secondView.splitDirection = Cesium.ImagerySplitDirection.RIGHT;

        var slider = document.getElementById('slider');
        that.viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

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
            that.viewer.scene.imagerySplitPosition = splitPosition;
        }





        // this.className = "button-selected";
       /* this.toggle($("#slider"), function() {
            console.log(layer.secondDate)
        }, function() {
         //   that.secondView.splitDirection =  Cesium.ImageryLayer.DEFAULT_SPLIT;
        });*/

      /*  var referenceLayerProvider = provider.getProvider("Reference_Labels", '2016-11-19', "image/png", "epsg4326", "250m");
        viewer.scene.imageryLayers.addImageryProvider(referenceLayerProvider);*/
    }

    /**
     *
     * @param div
     * @param callbackOn
     * @param callbackOff
     */
    EarthTrekCompare.prototype.toggle = function(div, callbackOn, callbackOff) {
        console.log(div.is(":visible"))
        if (div.is(":visible")) {
            div.hide();
            callbackOff();
        } else  {
            div.show();
            callbackOn();
        }
    }

    return EarthTrekCompare;
    module.exports = EarthTrekCompare;
});