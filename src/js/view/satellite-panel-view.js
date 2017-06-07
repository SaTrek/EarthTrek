/**
 * @class SatellitePanelView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 MAY 2017.
 */

var $ = require('jquery');
var moment = require('moment');
var bootstrap = require('bootstrap');
var JulianDate = require('cesium/Source/Core/JulianDate');

var provider = require('../earthtrek-provider');
var satellitePropagation = require('../satellite-propagation');
var SatelliteLayerView = require('./satellite-layer-view');

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
    this.layerView = new SatelliteLayerView(viewer);
}

SatellitePanelView.prototype.getLayerView = function () {
    return this.layerView;
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
    var properties = entity.properties.getValue(this.viewer.clock.currentTime);
    var data = properties.data;
    var velocity = satellitePropagation.getVelocity(entity.velocity.getValue(this.viewer.clock.currentTime));
    data.velocity = velocity;

    data.altitude = (entity.altitude.getValue(this.viewer.clock.currentTime)/1000).toFixed(1) ;
    var that = this;

    var descriptionContainer = '#satellite-description';
    $(descriptionContainer).html(properties.description);

    $.each(data, function(key, value) {
        var orbitalData = document.createElement('div');

        var orbitalDataKey = document.createElement('div');
        $(orbitalDataKey).addClass("orbital-data-keys");

        $(orbitalDataKey).html(function () {
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
        $(orbitalData).append(orbitalDataKey);

        var orbitalDataValue = document.createElement('div');
        $(orbitalDataValue).addClass("orbital-data-values");
        var value = that.magnitudesToOrbitalData(key, value);
        $(orbitalDataValue).addClass('satellite-data-' + key);
        $(orbitalDataValue).append((value != '') ? value : "-");
        $(orbitalData).append(orbitalDataValue);
        $(that.satelliteInfoContainer).append(orbitalData);
    });

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
                agenciesLogos += '<img class="agency" alt="' + agencyName + '" title="' + agencyName + '" src="images/agency/40/' + agencyName + '.png"/> ';
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

/**
 *
 * @param entity
 * @returns {boolean}
 */
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
        //   $(instrumentElement).click({entity: that.entity, panel: that, instrument: instrument}, that.showLayers);
        $(instrumentElement).html("<div>" + instrument.name + "</div>");
        $(instrumentElement).data('instrument', instrument.name);

        var layerButton = document.createElement("button");
        $(layerButton).click({entity: that.entity, panel: that.layerView, instrument: instrument}, that.layerView.showLayers);
        $(instrumentElement).append(layerButton);

        that.instrumentsContainer.append(instrumentElement);
    });
}
/**
 *
 * @param isoDateTime
 * @returns {*}
 */
SatellitePanelView.prototype.isoDate = function(isoDateTime) {
    return isoDateTime.split("T")[0];
};

module.exports = SatellitePanelView;