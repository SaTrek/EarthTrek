/**
 * @class Main
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 29 MAY 2017.
 */
/**
 * REQUIRES
 */
var EarthTrek = require('./js/earthtrek');
/**CSS*/
require('./css/main.css');
require('./css/left-toolbar.css');
require('./css/satellite.css');
require('./css/mobile.css');
require('./css/fonts/myriad.css');
var earthTrek = new EarthTrek({
    startTime: Date.UTC(1999, 1, 1),
    endTime: Date.now(),
    initialTime: Date.now(),
    mainContainer: 'main-container',
    frequency: 50,
    maxDistanceCamera: 10000000000 //10,000,000,000 meters
});
earthTrek.createViewer();
earthTrek.init();