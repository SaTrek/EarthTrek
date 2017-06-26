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
import MyEarthTrek from './src/my-earthtrek';
/**CSS*/
const earthTrek = new MyEarthTrek({
    startTime: Date.UTC(1999, 1, 1),
    endTime: Date.now(),
    initialTime: Date.now(),
    mainContainer: 'main-container',
    frequency: 50,
    maxDistanceCamera: 10000000000, //10,000,000,000 meters
    showReference: true,
    orbitalDataUpdateTime: 10
});
earthTrek.render();