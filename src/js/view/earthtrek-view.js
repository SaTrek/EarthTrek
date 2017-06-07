/**
 * @class EarthTrekView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 28 MAY 2017.
 */
define([
], function () {

    function EarthTrekView(viewer, options) {
        this.viewer = viewer;
        var options = options || {};
        if (!options.showTutorial) {
            options.showTutorial = false;
        }
        this.showTutorial = options.showTutorial;
        this.welcomeContainer = '#earthtrek-welcome';
    }

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


    return EarthTrekView;
});