/**
 * @class EarthTrekDataTest
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrekCore - 29 JUN 2017.
 */
const fs = require('fs');

const earthTrekData = require('../src/js/earthtrek-data');

describe('Get Satellites', function(){
    before(function (done) {
        /*     nock('http://api.orbitaldesign.tk')
         .get('satellites')
         .reply(200, function () {
         const satelliteData = (JSON.parse(fs.readFileSync('./test/data/satellites.json', "utf8")));
         return satelliteData;
         });
         */
        done();
    });

    after(function (done) {
        done();
    });

    it('Get Satellites', ()  => {
        earthTrekData.getSatellites().then((satellites) => {
            console.log(satellites)
        });
       /* earthTrekData.getFullData({getCache: false},  (satellites) => {
            console.log(satellites)
        });*/
    });
});