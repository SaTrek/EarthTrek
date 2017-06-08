/**
 * @class SatelliteToolbarView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 MAY 2017.
 */

var moment = require('moment');
var slick = require('slick-carousel');
require('slick-carousel/slick/slick.css');
require('slick-carousel/slick/slick-theme.css');
require('bootstrap/dist/css/bootstrap.min.css');

var Cesium = require('../cesium');
var earthTrekToolbar = require('../earthtrek-toolbar');


/**
 * SatelliteToolbarView constructor
 * @param viewer
 * @param toolbarContainerId
 * @param satellitePanel
 * @constructor
 */
function SatelliteToolbarView (viewer, toolbarContainerId, satellitePanel) {
    this.viewer = viewer;
    this.mainContainerId = this.viewer.container.id;
    this.toolbarContainerId = toolbarContainerId;
    this.satellites = [];
    this.satellitePanel = satellitePanel;
}

/**
 * Update satellite availability
 * @param entity
 * @param goToCallback
 * @param time
 */
SatelliteToolbarView.prototype.updateSatellite = function (entity, goToCallback, time) {
    if (entity.isAvailable(time)) {
        $("." + entity.id + "-toolbar").removeClass("satellite-disabled");
    } else {
        $("." + entity.id + "-toolbar").addClass("satellite-disabled");
    }
}

/**
 * Add satellite to toolbar
 * @param satelliteData
 * @param goToCallback
 * @returns {Element}
 */
SatelliteToolbarView.prototype.addSatellite = function (satelliteData, goToCallback) {
    var that = this;
    var satelliteContainer = document.createElement('div');
    $(satelliteContainer).addClass(satelliteData.satId + '-toolbar');
    $(satelliteContainer).attr('id', 'satellite-toolbar-container');

    var satelliteImage = document.createElement('img');
    $(satelliteImage).attr("src", 'images/satellites/' + satelliteData.image)
    $(satelliteContainer).append(satelliteImage);
    if (satelliteData.endDate != null) {
        $(satelliteContainer).addClass("satellite-disabled");
    }

    $(satelliteContainer).click(function() {
        if ($(this).hasClass("satellite-disabled")) {
            return false;
        }
        var entity = that.viewer.entities.getById(satelliteData.satId);
        if (entity) {
            var selected = goToCallback(entity, that.satellitePanel, that.viewer);
            if (selected == true) {
                $(".satellite-selected").removeClass("satellite-selected");
                $(satelliteContainer).addClass("satellite-selected");
            }
        }
    });

    $(satelliteContainer).popover({
        trigger: 'manual',
        html: true,
        title: this.getPopoverTitle(satelliteData, goToCallback, satelliteContainer),
        content: this.getPopoverContent(satelliteData, goToCallback, satelliteContainer),
        placement: 'bottom',
        container: "#" + this.toolbarContainerId
    }).on("mouseenter", function () {
        var _this = this;
        $(this).popover("show");
        $(".popover").on("mouseleave", function () {
            $(_this).popover('hide');
        });
    }).on("mouseleave", function () {
        var _this = this;
        setTimeout(function () {
            if (!$(".popover:hover").length) {
                $(_this).popover("hide");
            }
        }, 100);
    });
    this.satellites.push(satelliteContainer);
    return satelliteContainer;
}

/**
 * Get Popover Title
 * @param satelliteData
 * @param goToCallback
 * @param satelliteContainer
 * @returns {*|jQuery|HTMLElement}
 */
SatelliteToolbarView.prototype.getPopoverTitle = function (satelliteData, goToCallback, satelliteContainer) {
    var that = this;
    var satelliteTitlePopoverContainer = document.createElement('div');
    var satelliteTitle = document.createElement('div');
    $(satelliteTitle).html(satelliteData.name);
    $(satelliteTitlePopoverContainer).append(satelliteTitle);
    return $(satelliteTitlePopoverContainer);
}

/**
 * Get Popover Content
 * @param satelliteData
 * @param goToCallback
 * @param satelliteContainer
 * @returns {Element}
 */
SatelliteToolbarView.prototype.getPopoverContent = function (satelliteData, goToCallback, satelliteContainer) {
    var that = this;
    var satellitePopoverContainer = document.createElement('div');
    var satelliteOptions = document.createElement('div');

    $(satelliteOptions).addClass('satellite-options');
    var entity = that.viewer.entities.getById(satelliteData.satId);
    var zoomOption = document.createElement('button');
    $(zoomOption).addClass('satellite-zoom');
    $(zoomOption).click(function() {
        if (entity && entity.isAvailable(that.viewer.clock.currentTime)) {
            var selected = goToCallback(entity, that.satellitePanel, that.viewer, true);
            if (selected == true) {
                $(".satellite-selected").removeClass("satellite-selected");
                $(satelliteContainer).addClass("satellite-selected");
            }
        }
    });
    $(satelliteOptions).append(zoomOption);


    var hideOption = document.createElement('button');
    $(hideOption).addClass(entity.isShowing ? 'satellite-hide': 'satellite-show');
    $(hideOption).click(function() {
        if (entity && entity.isAvailable(that.viewer.clock.currentTime)) {
            entity.show = !entity.show;
            if ($(hideOption).hasClass('satellite-hide')) {
                $(hideOption).removeClass('satellite-hide');
            }
            if ($(hideOption).hasClass('satellite-show')) {
                $(hideOption).removeClass('satellite-show');
            }
            $(hideOption).addClass(entity.isShowing ? 'satellite-hide': 'satellite-show');
        }
    });
    $(satelliteOptions).append(hideOption);

    $(satellitePopoverContainer).append(satelliteOptions);

    var launchDate = document.createElement('div');
    $(launchDate).html("Launch date");
    $(satellitePopoverContainer).append(launchDate);

    var launchDateButton = document.createElement('button');
    $(launchDateButton).html(moment(satelliteData.launchDate).format('DD MMM Y'));
    $(launchDateButton).click(function() {
        var entity = that.viewer.entities.getById(satelliteData.satId);
        if (entity) {
            var selected = goToCallback(entity, that.satellitePanel, that.viewer);
            if (selected == true) {
                $(".satellite-selected").removeClass("satellite-selected");
                $(satelliteContainer).addClass("satellite-selected");
            }
        }
        that.viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(satelliteData.launchDate));
    });
    $(satellitePopoverContainer).append(launchDateButton);

    if (satelliteData.endDate != null) {
        var lastContact = document.createElement('div');
        $(lastContact).html("Last contact");
        $(satellitePopoverContainer).append(lastContact);
        var lastContactButton = document.createElement('button');
        $(lastContactButton).html(moment(satelliteData.endDate).format('DD MMM Y'));
        $(lastContactButton).click(function() {
            that.viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(satelliteData.endDate));
        });
        $(satellitePopoverContainer).append(lastContactButton);

    }
    $(satellitePopoverContainer).addClass('satellite-popover');

    var description = document.createElement('div');
    $(description).attr('id', 'satellite-toolbar-description');
    $(description).html(satelliteData.description);
    $(description).addClass('satellite-description');
    $(satellitePopoverContainer).append(description);
    return satellitePopoverContainer;
}

SatelliteToolbarView.prototype.append = function (element) {

}

/**
 *
 */
SatelliteToolbarView.prototype.render = function () {
    var that = this;
    this.toolbarContainer = earthTrekToolbar.create(this.toolbarContainerId, function(toolbarContainer) {
        that.satellites.forEach(function(satelliteContainer) {
            $(toolbarContainer).append(satelliteContainer);
        });

        $(toolbarContainer).slick({
            slidesToShow: 3,
            slidesToScroll: 4,
            infinite: false,
            variableWidth: true
        })
    });

    $("#" + this.mainContainerId).append(this.toolbarContainer);
}

module.exports = SatelliteToolbarView;