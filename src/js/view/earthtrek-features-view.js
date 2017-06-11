/**
 * @class EarthTrekFeaturesView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 11 JUN 2017.
 */
require('../../css/features.css');

function EarthTrekFeaturesView(viewer, options) {
    this.viewer = viewer;
    var options = options || {};
    if (!options.container) {
        options.container = '#earthtrek-features';
    }
    if (!options.show) {
        options.show = true;
    }

    this.container = options.container;
    this.show = options.show;
}

EarthTrekFeaturesView.prototype.display = function (response) {
    var that = this;
    $(this.container).show();

    $(window).click(function() {
        if ($(that.container).is(':visible')) {
            that.hide();
        }
    });
   $(this.container + ' .panel-text').html(response.data[0].text);
}
EarthTrekFeaturesView.prototype.hide = function (tutorialView) {
    $(this.container).remove();
    localStorage.setItem('displayed-features', true);
}

module.exports = EarthTrekFeaturesView;