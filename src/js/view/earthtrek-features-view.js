/**
 * @class EarthTrekFeaturesView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 11 JUN 2017.
 */
require('../../css/features.css');
var slick = require('slick-carousel');
require('slick-carousel/slick/slick.css');
require('slick-carousel/slick/slick-theme.css');

/**
 * New features constructor
 * @param viewer
 * @param options
 * @constructor
 */
function EarthTrekFeaturesView(viewer, options) {
    this.viewer = viewer;
    var options = options || {};
    if (!options.container) {
        options.container = '#earthtrek-features';
    }
    if (!options.show) {
        options.show = true;
    }

    this.container = '#' + options.container;
    this.show = options.show;
    $('#new-features-button').click(function () {
        $('#' + that.options.container).show();
    });
}

/**
 * Display new features
 * @param response
 */
EarthTrekFeaturesView.prototype.display = function (response) {
    var that = this;
    $(this.container).show();

    $(this.container + ' .panel-text').click(function(event) {
        event.stopPropagation();
    });

    $(window).click(function(e) {
        if ($(that.container).is(':visible')) {
            that.hide();
        }
    });

    response.data.forEach(function (feature) {
        $(that.container + ' .panel-text').append('<div>' + feature.text + '</div>');
    });

    $(this.container + ' .panel-text').slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 15000
    });
}

/**
 * Hide new features panel
 */
EarthTrekFeaturesView.prototype.hide = function () {
    $(this.container).hide();
    localStorage.setItem('displayed-features', true);
}

module.exports = EarthTrekFeaturesView;