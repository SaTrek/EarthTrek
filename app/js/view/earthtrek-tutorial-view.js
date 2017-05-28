/**
 * @class EarthTrekTutorialView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 28 MAY 2017.
 */

define([
    'cesium'
], function () {
    'use strict';

    /**
     * @param options
     * @constructor
     */
    function EarthTrekTutorialView(viewer, options) {
        this.viewer = viewer;
        this.tutorialContainer = '#earthtrek-tutorial';
        this.runningTutorial = true;
    }

    /**
     *
     */
    EarthTrekTutorialView.prototype.firstStep = function () {
        var that = this;
        $(this.tutorialContainer).show();
        var handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        handler.setInputAction(function (movement) {
            var globe = that.viewer.scene.globe;
            var ray = that.viewer.camera.getPickRay(movement.position);
            var intersection = globe.pick(ray, that.viewer.scene);
            if (intersection != undefined) {
                handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
                that.secondStep();
            }
        }, Cesium.ScreenSpaceEventType.LEFT_UP);

        $(this.tutorialContainer).html('Este es nuestro hogar: la Tierra. Pulsando y manteniendo el clic izquierdo del mouse sobre el globo, usted podra rotarlo. Una vez que usted termine de rotar la Tierra, suelte el boton para continuar ¡Intentelo!');
    }

    /**
     *
     */
    EarthTrekTutorialView.prototype.secondStep = function () {
        $(this.tutorialContainer).html('¡Perfecto! La Tierra tiene un radio aproximado de 6378 km y posee casi 1500 satelites en orbita. Generalmente se clasifican por su altura: Low Earh Orbit (LEO), Medium Earth Orbit (MEO) y Geostationary Orbit (GEO). Ahora: prueba hacer clic en un satelite.');
    }

    /**
     *
     * @param entity
     */
    EarthTrekTutorialView.prototype.thirdStep = function (entity) {
        var that = this;
        $('.satellite-instrument button').addClass('blink');
        $('.satellite-instrument button').click(function() {
            if (that.runningTutorial) {
                that.fourthStep(entity);
            }
        });
        $(this.tutorialContainer).html("En este momento te encuentras siguiendo la orbita de " + entity.properties.getValue().name + ", uno de los satelites del programa " + entity.properties.getValue().data.program + " de " + entity.properties.getValue().data.agency + ". Son más de 25 satelites que orbitan o han orbitado la Tierra, recolectando datos con sus instrumentos.\n Ahora: selecciona uno de los instrumentos que se encuentran en el panel derecho.");
    }

    /**
     *
     * @param entity
     */
    EarthTrekTutorialView.prototype.fourthStep = function (entity) {
        $('.satellite-instrument button').removeClass('blink');
        $('.satellite-instrument button').click(function() {

        });
        $('#earthtrek-tutorial').html("¡Así es! MODIS  es un instrumento científico lanzado en órbita terrestre por la NASA en 1999 a bordo del satélite Terra (EOS AM) y en 2002 a bordo del satélite Aqua. MODIS posee distinas aplicaciones entre las que se encuentran: temperatura de superficie (suelo y océano), detección de incendios, color del océano, cartografía de la vegetación, detección de cambios características de la nubosidad.");
    }
    return EarthTrekTutorialView;
});