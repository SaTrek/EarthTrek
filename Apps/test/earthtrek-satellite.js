/**
 * @class earthTrekSatelliteTest
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */
var assert = require('assert');
var should = require('should');
var earthTrekSatellite = require('../js/earthtrek-satellite');

describe('EarthTrek Satellite', function(){
    it('Get Sample Positions by 1000 seconds trajectory with 10 intervals', function(done) {

        /** ISS TLE*/
        var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
            tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';

        var intervals = 10;
        var seconds = 1000;
        var positions = earthTrekSatellite.calculatePositions(tleLine1, tleLine2, new Date(Date.UTC(2017, 4, 12, 0, 0, 0)), seconds, intervals);

        positions.times.should.not.empty();
        positions.values.should.not.empty();

        positions.times.should.have.size(intervals + 1);
        positions.values.should.have.size(intervals + 1);

  //      console.log(positions.times)
    //    positions.times[0].dayNumber.should.not.be.eql(NaN);
        done();
    });
});
