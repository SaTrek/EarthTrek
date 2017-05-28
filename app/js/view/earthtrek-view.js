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
        this.welcomeContainer = '#earthtrek-welcome';
    }

    EarthTrekView.prototype.welcome = function (tutorialView) {
        var that = this;
        $(this.welcomeContainer).show();
        $(this.welcomeContainer).append("<span class='earthtrek-welcome-title'>WELCOME TO EARTH TREK!</span>");
        $(this.welcomeContainer).append("<p>EarthTrek is an interactive 3D web application. It's easy access for all kinds of users encourages the use of data that NASA's EOS program compiles and collect with satellites's instruments.</p><p>It allows to visualize in real time the orbits of the different kinds of satellites around the Earth up to its launch until future predictions.</p><p>With this tool, we aim to encourage new generations to get involved in NASA's programs, from spreading the word to becoming active members -or even pioneers- of present and future developments.</p><p>Public engagement is key in the pursuit of aerospace exploration.</p>");

        var startButton = document.createElement('button');
        $(startButton).click(function() {
            $(that.welcomeContainer).hide();
            localStorage.setItem('started', true);
        });
        $(startButton).html("START");
        $(this.welcomeContainer).append(startButton);

        var tutorialButton = document.createElement('button');
        $(tutorialButton).click(function() {
            $(that.welcomeContainer).hide();
            localStorage.setItem('started', true);
            tutorialView.firstStep();
        });
        $(tutorialButton).html("TUTORIAL");
        $(this.welcomeContainer).append(tutorialButton);
    }

    return EarthTrekView;
});