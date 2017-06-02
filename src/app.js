requirejs.config({
    baseUrl: 'js',
    paths: {
        app: '../src/js',
        jquery: '../node_modules/jquery/dist/jquery.min',
        cesium: '../node_modules/cesium/Build/Cesium/Cesium',
        underscore: '../node_modules/underscore/underscore',
        satellitejs: '../node_modules/satellite.js/dist/satellite.min',
        bootstrap: '../node_modules/bootstrap/dist/js/bootstrap.min',
        slick: '../node_modules/slick-carousel/slick/slick.min',
        tle: '../node_modules/tle/lib/tle',
        moment: '../node_modules/moment/min/moment-with-locales.min',
    }
});

requirejs(['app/main']);