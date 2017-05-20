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
    'slick',
    'tle'
], function () {

    function SatellitePanelView(viewer, options) {
        this.viewer = viewer;
        this.mainContainerId = this.viewer.container.id;
        if (!options.container) {
            throw new Error('Invalid  Container');
        }
        if (options.satelliteInfoContainer) {
            this.satelliteInfoContainer = '#' + options.satelliteInfoContainer;
        } else {
            this.satelliteInfoContainer = '#satellite-info';
        }
        this.satellitePanel = $('#' + options.container);
        this.instrumentsContainer = $("#satellite-instruments");
    }

    SatellitePanelView.prototype.show = function (entity) {
        this.instrumentsContainer.empty();
        $(this.satelliteInfoContainer).empty();
        $('#satellite-instrument-layers').empty();
        if (entity.properties == undefined) {
            this.satellitePanel.hide();
            return false;
        }

        this.entity = entity;
        $('#satellite-name').html(entity.properties.name.getValue());

        var tle = this.entity.properties.getValue().tle.join("\n");
     //   var parsedTLE = TLE.parse( tle );
      //  console.log(parsedTLE);
    //    this.showOrbitalData(entity.properties.orbitalData.getValue());

        if (entity.properties.instruments !== undefined) {
            this.addInstruments(entity)
        }
        this.satellitePanel.show();
    }

    SatellitePanelView.prototype.showOrbitalData = function (data) {
        var that = this;
        var orbitalDataKeys = document.createElement('div');
        $(orbitalDataKeys).addClass("orbital-data-keys");
        var orbitalDataValues = document.createElement('div');
        $.each(data, function(key, value) {
            var orbitalDataKey = document.createElement('div');
            $(orbitalDataKey).append(key);
            $(orbitalDataKeys).append(orbitalDataKey);

            var orbitalDataValue = document.createElement('div');

            $(orbitalDataValue).append(that.magnitudesToOrbitalData(key, value));
            $(orbitalDataValues).append(orbitalDataValue);
        });

        $(this.satelliteInfoContainer).append(orbitalDataKeys);
        $(this.satelliteInfoContainer).append(orbitalDataValues);
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
            $(layerButton).click({entity: that.entity, panel: that}, that.showLayers);
            $(instrumentElement).append(layerButton);

            that.instrumentsContainer.append(instrumentElement);
        });
    }


    SatellitePanelView.prototype.showLayers = function (event) {
        var entity = event.data.entity;
        var panel = event.data.panel;
        $('.satellite-instrument .selected').removeClass('selected');

        $(this).addClass("selected");
        $("#satellite-instrument-layers").empty();
        $.each(entity.properties.instruments.getValue(), function(key, instrument) {
            if (instrument.name == $(event.target.parentElement).data('instrument')) {
                $.each(instrument.layers, function(key, layer) {
                    var instrumentLayer = panel.createLayer(layer);
                    $("#satellite-instrument-layers").append(instrumentLayer).show();
                });
            }
        });

        /*
        $("#accept-date").click(function () {
            if ($('#compare-date').val()) {
                var layer = {};
                layer.id = $('.compare-selected').parent().data("id");
                layer.firstDate = $('#compare-date').val();
                layer.secondDate = clock.currentTime.toString();
                layer.format = $('.compare-selected').parent().data("format");
                layer.resolution = $('.compare-selected').parent().data("resolution");

                compare(layer);
                $('#compare-modal').hide();
            }
        });*/
    }

    SatellitePanelView.prototype.createLayer = function(layer) {
        var instrumentLayer = document.createElement('div');
        $(instrumentLayer).addClass("instrument-layer");
        $(instrumentLayer).data("id", layer.id);
        $(instrumentLayer).data("startDate", layer.startDate);
        $(instrumentLayer).data("format", layer.format);
        $(instrumentLayer).data("resolution", layer.resolution);

        var endDate = (layer.endDate != null) ? layer.endDate : 'today';
        $(instrumentLayer).html("<div>" +layer.title + "</div>" + '<div class="layer-available"><span>Available: </span>' + layer.startDate + ' - ' + endDate  + '</div>');

        var toggleLayerButton = document.createElement("button");
        $(toggleLayerButton).on('click', function () {
            $(this).toggleClass('selected');
            var newProvider = provider.getProvider(layer.id, layer.startDate, layer.format, "epsg4326", layer.resolution);
            viewer.scene.imageryLayers.addImageryProvider(newProvider);
        });

        $(toggleLayerButton).addClass("view");
        $(instrumentLayer).append(toggleLayerButton);

        var compareButton = document.createElement("button");
        $(compareButton).html("C");
        $(compareButton).click(function () {
            $('.compare-selected').removeClass('compare-selected');
            $(this).addClass("compare-selected");
            $('#compare-modal').show();
        });
        $(instrumentLayer).append(compareButton);

        /*if (layer.endDate < isoDate(clock.currentTime.toString()) || layer.startDate > isoDate(clock.currentTime.toString())) {
            $(toggleLayerButton).attr('disabled', 'disabled');
            $(compareButton).attr('disabled', 'disabled');
        }*/
        return instrumentLayer;
    }

    SatellitePanelView.prototype.magnitudesToOrbitalData = function (key, value) {

        var data = {
            perigee: 'KM',
            apogee: 'KM',
            inclination: '�',
            period: 'mins'
        }
        if (data[key] == undefined) {
            return value;
        }
        return value + ' ' + data[key];
    }

    SatellitePanelView.prototype.render = function () {

    }

    return SatellitePanelView;
});