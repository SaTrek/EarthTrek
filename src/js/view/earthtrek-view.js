/**
 * @class EarthTrekView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 28 MAY 2017.
 */

require('../../css/welcome.css');
var earthTrekData = require('../earthtrek-data');
var EarthTrekFeaturesView = require('./earthtrek-features-view');

function EarthTrekView(viewer, options) {
    this.viewer = viewer;
    var options = options || {};
    if (!options.showTutorial) {
        options.showTutorial = false;
    }
    this.options = options;
    this.showTutorial = options.showTutorial;
    this.welcomeContainer = '#earthtrek-welcome';

    if (localStorage.getItem("displayed-features") == null) {
        this.showNewFeatures();
    }
    var startButton = $('.earthtrek-start');
    $(startButton).click(function() {
        $(that.welcomeContainer).remove();
        localStorage.setItem('started', true);
    });


}
/**
 *
 * @param tutorialView
 */
EarthTrekView.prototype.welcome = function (tutorialView) {
    var that = this;
    $(this.welcomeContainer).show();

    $(window).click(function() {
        if ($(that.welcomeContainer).is(':visible')) {
            $(that.welcomeContainer).remove();
            localStorage.setItem('started', true);
        }
    });

    var startButton = $('#earthtrek-welcome-start');
    $(startButton).click(function() {
        $(that.welcomeContainer).remove();
        localStorage.setItem('started', true);
    });

    var tutorialButton = $('#earthtrek-welcome-tutorial');
    this.showTutorial == true ?  $(tutorialButton).show() :  $(tutorialButton).hide();
    $(tutorialButton).show = this.showTutorial;
    $(tutorialButton).click(function() {
        $(that.welcomeContainer).hide();
        localStorage.setItem('started', true);
        tutorialView.firstStep();
    });
}
/**
 *
 */
EarthTrekView.prototype.showNewFeatures = function () {
    var that = this;
    var newFeaturesView = new EarthTrekFeaturesView(this.viewer, this.options.newFeatures || {});
    earthTrekData.getFeatures().then(function(data) {
        newFeaturesView.display(data);
    });
}

module.exports = EarthTrekView;