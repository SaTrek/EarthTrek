// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'js',
    paths: {
        app: '../app/js',
        jquery: '../node_modules/jquery/dist/jquery.min',
        cesium: '../node_modules/cesium/Build/CesiumUnminified/Cesium',
        underscore: '../node_modules/underscore/underscore',
        satellitejs: '../node_modules/satellite.js/dist/satellite.min',
        bootstrap: '../node_modules/bootstrap/dist/js/bootstrap.min',
        slick: '../node_modules/slick-carousel/slick/slick.min',
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['app/main']);