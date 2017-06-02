/**
 * @class SatellitePanelView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 MAY 2017.
 */
define([
    'jquery',
    'bootstrap',
    'slick',
    'moment',
    '../provider',
    '../satellite-propagation'
], function ($,b,s,moment) {

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

        this.showOrbitalData(entity);
        if (entity.properties.instruments !== undefined) {
            this.addInstruments(entity)
        }
        this.satellitePanel.show();
    }

    SatellitePanelView.prototype.updateOrbitalData = function (entity) {
        if ($('.satellite-data-velocity').length > 0 && entity.velocity.getValue(this.viewer.clock.currentTime) != undefined) {
            var velocity = satellitePropagation.getVelocity(entity.velocity.getValue(this.viewer.clock.currentTime));
            $($('.satellite-data-velocity')[0]).html(parseFloat(velocity).toFixed(2) + ' km/s');
        }

        if ($('.satellite-data-altitude').length > 0 && entity.altitude.getValue(this.viewer.clock.currentTime) != undefined) {
            $($('.satellite-data-altitude')[0]).html((entity.altitude.getValue(this.viewer.clock.currentTime)/1000).toFixed(1) + ' km');
        }
    }

    SatellitePanelView.prototype.showOrbitalData = function (entity) {
        var properties = entity.properties.getValue();
        var data = properties.data;
        var velocity = satellitePropagation.getVelocity(entity.velocity.getValue(this.viewer.clock.currentTime));
        data.velocity = velocity;

        data.altitude = (entity.altitude.getValue(this.viewer.clock.currentTime)/1000).toFixed(1) ;
        var that = this;

        var descriptionContainer = '#satellite-description';
        $(descriptionContainer).html(properties.description);

        var orbitalDataKeys = document.createElement('div');
        $(orbitalDataKeys).addClass("orbital-data-keys");
        var orbitalDataValues = document.createElement('div');
        $(orbitalDataValues).addClass("orbital-data-values");
        $.each(data, function(key, value) {
            var orbitalDataKey = document.createElement('div');
            $(orbitalDataKey).append(function () {
                var data = {
                    launchDate: 'Launch Date',
                    argumentPerigee: 'Arg of Perigee',
                    meanAnomaly: 'Mean Anomaly'
                }
                if (data[key] == undefined) {
                    return key;
                }
                return data[key];
            });
            $(orbitalDataKeys).append(orbitalDataKey);

            var orbitalDataValue = document.createElement('div');
            var value = that.magnitudesToOrbitalData(key, value);
            $(orbitalDataValue).addClass('satellite-data-' + key);
            $(orbitalDataValue).append((value != '') ? value : "-");
            $(orbitalDataValues).append(orbitalDataValue);
        });

        $(this.satelliteInfoContainer).append(orbitalDataKeys);
        $(this.satelliteInfoContainer).append(orbitalDataValues);
    }

    /**
     * Magnitudes To Orbital Data
     * @param key
     * @param value
     * @returns {*}
     */
    SatellitePanelView.prototype.magnitudesToOrbitalData = function (key, value) {

        if (key == 'launchDate') {
            return moment(value).format('DD MMM Y');
        }
        if (key == 'agency') {
            var agenciesLogos = '';
            if (value == '') {
                return value;
            }
            var agencies = value.split('/');
            if (agencies.length > 0) {
                agencies.forEach(function(agencyName) {
                    agenciesLogos += '<img width=28" alt="' + agencyName + '" title="' + agencyName + '" src="images/agency/256/' + agencyName + '.png"/> ';
                })
            }
            return agenciesLogos;
        }
        var data = {
            altitude: 'km',
            perigee: 'km',
            apogee: 'km',
            inclination: '&deg;',
            meanAnomaly: '',
            argumentPerigee: '&deg;',
            period: 'mins',
            velocity: 'km/s',
            mass: 'kg'
        }
        if (data[key] == undefined) {
            return value;
        }
        return value.toLocaleString() + ' ' + data[key];
    }

    SatellitePanelView.prototype.hide = function () {
        this.satellitePanel.hide();
    }

    SatellitePanelView.prototype.addInstruments = function (entity) {
        var that = this;
        var instruments = entity.properties.instruments.getValue();
        if (instruments.length === 0) {
            return false;
        }
        instruments.forEach(function(instrument) {
            if (instrument == null) {
                return false;
            }
            var instrumentElement = document.createElement('div');
            $(instrumentElement).id = "satellite-instrument-" + entity.id + "-" + instrument.name;
            $(instrumentElement).addClass("satellite-instrument");
            $(instrumentElement).html("<div>" + instrument.name + "</div>");
            $(instrumentElement).data('instrument', instrument.name);

            var layerButton = document.createElement("button");
            $(layerButton).click({entity: that.entity, panel: that, instrument: instrument}, that.showLayers);
            $(instrumentElement).append(layerButton);

            that.instrumentsContainer.append(instrumentElement);
        });
    }

    /**
     *
     * @param event
     * @returns {boolean}
     */
    SatellitePanelView.prototype.updateLayers = function (event) {
        var that = this;
        var today = this.isoDate(this.viewer.clock.currentTime.toString());
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
                        layer.endDate = that.isoDate(present.toISOString());
                    }
                    if (layer.startDate <= today && layer.endDate >= today) {
                        $('#layer-view-' + layer.id).removeAttr('disabled');
                    } else {
                        $('#layer-view-' + layer.id).attr('disabled', 'disabled');
                    }
                });
            }
        });
    }

    /**
     *
     * @param event
     */
    SatellitePanelView.prototype.showLayers = function (event) {
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
    /**
     *
     * @param layer
     * @returns {Element}
     */
    SatellitePanelView.prototype.createLayer = function(layer) {
        var that = this;
        var instrumentLayer = document.createElement('div');
        $(instrumentLayer).addClass("instrument-layer");
        $(instrumentLayer).data("id", layer.id);
        $(instrumentLayer).data("startDate", layer.startDate);
        $(instrumentLayer).data("format", layer.format);
        $(instrumentLayer).data("resolution", layer.resolution);


        var endDate = (layer.endDate == null) ? 'Present' : layer.endDate;

        var startDateButton = document.createElement('button');
        $(startDateButton).html(layer.startDate);
        $(startDateButton).click(function() {
            that.viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(layer.startDate));
        });
        var endDateButton = document.createElement('button');
        $(endDateButton).html(endDate);
        $(endDateButton).click(function() {
            var endDateObj = new Date(layer.endDate);
            if (layer.endDate == null) {
                endDateObj = new Date();
            }
            that.viewer.clock.currentTime = Cesium.JulianDate.fromDate(endDateObj);
        });

        var layerAvailable = document.createElement('div');
        $(layerAvailable).addClass("layer-available");
        $(layerAvailable).html('<span>Available:</span>');
        $(layerAvailable).append(startDateButton);
        $(layerAvailable).append(' - ');
        $(layerAvailable).append(endDateButton);

        $(instrumentLayer).html("<div>" + layer.title + "</div>");
        $(instrumentLayer).append(layerAvailable);

        var instrumentButtons = document.createElement("div");
        $(instrumentButtons).addClass('fixed-buttons');
        $(instrumentLayer).append(instrumentButtons);
        /**
         * SHOW LAYER
         * @type {Element}
         */
        var today = this.isoDate(this.viewer.clock.currentTime.toString());
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
                earthTrekLayer.hideLayer(layer);
                var maximumLevel = (layer.format == 'image/png') ? 2 : 12;
                var newLayerProvider = provider.getProvider({
                    layer: layer.id,
                    time: that.isoDate(that.viewer.clock.currentTime.toString()),
                    format: layer.format,
                    tileMatrixSetID: "epsg4326",
                    resolution: layer.resolution,
                    maximumLevel: maximumLevel
                });

                if (that.viewer.scene.imageryLayers._layers[0].format == 'image/jpeg') {
                    that.viewer.scene.imageryLayers._layers[0].show = false;
                //    that.viewer.scene.imageryLayers.lowerToBottom(that.viewer.scene.imageryLayers._layers[0].show = false);
                }
                var addedLayer = that.viewer.scene.imageryLayers.addImageryProvider(newLayerProvider);
                if (layer.format == 'image/jpeg') {
                    that.viewer.scene.imageryLayers.lowerToBottom(addedLayer);
                }
            }

        });

        $(toggleLayerButton).addClass("view");
        $(instrumentButtons).append(toggleLayerButton);

        this.addCompareButton(instrumentButtons);

        if (layer.endDate < today || layer.startDate > today) {
            $(toggleLayerButton).attr('disabled', 'disabled');
        }
        return instrumentLayer;
    }

    /**
     * Add Compare Button
     * @param instrumentButtons
     */
    SatellitePanelView.prototype.addCompareButton = function(instrumentButtons) {
        var compareButton = document.createElement("button");
        $(compareButton).html("");
        $(compareButton).click(function () {
            $('.compare-selected').removeClass('compare-selected');
            $(this).addClass("compare-selected");
            $('#compare-modal').show();
        });
        $(instrumentButtons).append(compareButton);

        $(compareButton).attr('disabled', 'disabled');
    };

    SatellitePanelView.prototype.isoDate = function(isoDateTime) {
        return isoDateTime.split("T")[0];
    };

    SatellitePanelView.prototype.render = function () {

    }

});

module.exports = SatellitePanelView;