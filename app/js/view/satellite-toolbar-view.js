/**
 * @class SatelliteToolbarView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 13 APR 2017.
 */
//require("amd-loader");
define([
    'bootstrap',
    'slick',
    'earthtrek-toolbar'
], function() {

    function SatelliteToolbarView (viewer, toolbarContainerId, satellitePanel) {
        this.viewer = viewer;
        this.mainContainerId = this.viewer.container.id;
        this.toolbarContainerId = toolbarContainerId;
        this.satellites = [];
        this.satellitePanel = satellitePanel;
    }

    SatelliteToolbarView.prototype.updateSatellite = function (entity, goToCallback, time) {

        (time >= entity.properties.getValue().endDate) ?
            $("." + entity.id + "-toolbar").addClass("satellite-disabled")
            : $("." + entity.id + "-toolbar").removeClass("satellite-disabled");

        (time < entity.properties.getValue().launchDate) ?
            $("." + entity.id + "-toolbar").addClass("satellite-disabled")
            : $("." + entity.id + "-toolbar").removeClass("satellite-disabled");
    }

    SatelliteToolbarView.prototype.addSatellite = function (satelliteData, goToCallback) {
        var that = this;
        var satelliteContainer = document.createElement('div');
        $(satelliteContainer).addClass(satelliteData.satId + '-toolbar');

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
            trigger: 'hover',
            title: satelliteData.name,
            content: satelliteData.description,
            placement: 'bottom',
            container: "#" + this.toolbarContainerId
        });
        this.satellites.push(satelliteContainer);
        return satelliteContainer;
    }


    SatelliteToolbarView.prototype.append = function (element) {

    }

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

    return SatelliteToolbarView;
});