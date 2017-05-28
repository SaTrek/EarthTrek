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
        this.tutorialTextContainer = '#earthtrek-tutorial-text';
        this.runningTutorial = false;

    }

    /**
     *
     */
    EarthTrekTutorialView.prototype.firstStep = function () {
        this.runningTutorial = true;
        var that = this;
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

        $(this.tutorialContainer).show();
        $('#earthtrek-tutorial-skip').click(function() {
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_UP);
            that.secondStep();
        });
        $('#earthtrek-tutorial-finish').click(function() {
            $(that.tutorialContainer).hide();
        });

        $(this.tutorialTextContainer).html('Este es nuestro hogar: la Tierra. Pulsando y manteniendo el clic izquierdo del mouse sobre el globo, usted podra rotarlo. Una vez que usted termine de rotar la Tierra, suelte el boton para continuar &iexcl;Intentelo!');
    }

    /**
     *
     */
    EarthTrekTutorialView.prototype.secondStep = function () {
        $(this.tutorialTextContainer).html('&iexcl;Perfecto! La Tierra tiene un radio aproximado de 6378 km y posee casi 1500 satelites en orbita. Generalmente se clasifican por su altura: Low Earh Orbit (LEO), Medium Earth Orbit (MEO) y Geostationary Orbit (GEO). Ahora: prueba hacer clic en un satelite.');
    }

    /**
     *
     * @param entity
     */
    EarthTrekTutorialView.prototype.thirdStep = function (entity) {
        var that = this;
        if (!that.runningTutorial) {
            return false;
        }

        $('.satellite-instrument button').addClass('blink');
        $('.satellite-instrument button').click(function() {
            that.fourthStep(entity);
        });
        $(this.tutorialTextContainer).html("En este momento te encuentras siguiendo la orbita de " + entity.properties.getValue().name + ", uno de los satelites del programa " + entity.properties.getValue().data.program + " de " + entity.properties.getValue().data.agency + ". Son m&aacute;s de 25 satelites que orbitan o han orbitado la Tierra, recolectando datos con sus instrumentos.\n Ahora: selecciona uno de los instrumentos que se encuentran en el panel derecho.");
    }

    /**
     *
     * @param entity
     */
    EarthTrekTutorialView.prototype.fourthStep = function (entity) {
        $('.satellite-instrument button').removeClass('blink');
        $('.satellite-instrument button').click(function() {

        });
        $(this.tutorialTextContainer).html("&iexcl;As&iacute; es! MODIS  es un instrumento cient&iacute;fico lanzado en &oacute;rbita terrestre por la NASA en 1999 a bordo del sat&eacute;lite Terra y en 2002 a bordo del sat&eacute;lite Aqua. MODIS posee distinas aplicaciones entre las que se encuentran: temperatura de superficie (suelo y oc&eacute;ano), detecci&oacute;n de incendios, color del oc&eacute;ano, cartograf&iacute;a de la vegetaci&oacute;n, detecci&oacute;n de cambios y caracter&iacute;sticas de la nubosidad.");
    }
    return EarthTrekTutorialView;
});