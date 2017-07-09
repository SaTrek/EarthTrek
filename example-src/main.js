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
import MyEarthTrek from './src/my-earthtrek-src';
/**CSS*/
const earthTrek = new MyEarthTrek({
    startTime: Date.UTC(1999, 1, 1),
    endTime: Date.now(),
    initialTime: Date.now(),
    mainContainer: 'main-container',
    maxDistanceCamera: 10000000000, //10,000,000,000 meters
    showReference: true,
    orbitalDataUpdateTime: 10,
    entities: {
        orbitDuration: ENTITY_ORBIT_DURATION,
        frequency: ENTITY_FREQUENCY,
        label: {
            show: true
        }
    }
});
earthTrek.render();