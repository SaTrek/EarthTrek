/**
 * @class SatellitePropagatinTest
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 12 MAY 2017.
 */
var assert = require('assert');
var should = require('should');
var satellitePropagation = require('../src/js/satellite-propagation');

describe('Propagate Satellite', function(){
    it('get satellite position by two different dates using one TLE', function(done) {

        /** ISS TLE*/
        var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
            tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';

        /** Check Date 2017-05-12 00:00:00*/
        var satellitePos = satellitePropagation.getPositionAndVelocity(tleLine1, tleLine2, new Date(Date.UTC(2017, 4, 12, 0, 0, 0)));
        satellitePos = satellitePos.position;
        satellitePos.longitude.should.be.eql(-153.59059022371355);
        satellitePos.latitude.should.be.eql(-37.83622435319241);
        satellitePos.height.should.be.eql(416649.42277589487);

        /** Check Date 2017-05-13 00:00:00*/
        var satellitePos = satellitePropagation.getPositionAndVelocity(tleLine1, tleLine2, new Date(Date.UTC(2017, 4, 13, 0, 0, 0)));
        satellitePos = satellitePos.position;
        satellitePos.longitude.should.be.eql(41.29259346532467);
        satellitePos.latitude.should.be.eql(47.303016437321375);
        satellitePos.height.should.be.eql(409636.11279614177);
        done();
    });

    it('get satellite position by two different dates using two TLE', function(done) {

        /** ISS TLE EPOCH: 17132.53751028*/
        var tleLine1 = '1 25544U 98067A   17132.53751028  .00016717  00000-0  10270-3 0  9035',
            tleLine2 = '2 25544  51.6411 216.0049 0005344 152.4463 207.6974 15.54000018 16201';

        /** Check Date 2017-05-12 00:00:00*/
        var satellitePos = satellitePropagation.getPositionAndVelocity(tleLine1, tleLine2, new Date(Date.UTC(2017, 4, 12, 0, 0, 0)));
        satellitePos = satellitePos.position;
        satellitePos.longitude.should.be.eql(-153.56277908628084);
        satellitePos.latitude.should.be.eql(-37.8542342346344);
        satellitePos.height.should.be.eql(416599.21455002675);

        /** Check Date 2017-05-13 00:00:00*/
        /** ISS TLE EPOCH: 17133.30919458*/
        var tleLine1 = '1 25544U 98067A   17133.30919458  .00016717  00000-0  10270-3 0  9045',
            tleLine2 = '2 25544  51.6386 212.1565 0005483 154.1122 206.0305 15.54010446 16327';
        var satellitePos = satellitePropagation.getPositionAndVelocity(tleLine1, tleLine2, new Date(Date.UTC(2017, 4, 13, 0, 0, 0)));
        satellitePos = satellitePos.position;
        satellitePos.longitude.should.be.eql(41.20648535868128);
        satellitePos.latitude.should.be.eql(47.27483461674835);
        satellitePos.height.should.be.eql(409675.6210569192);
        done();
    });

    it('get satellite velocity magnitude in KM/s', function(done) {

        /** ISS TLE*/
        var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
            tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';

        /** Check Date 2017-05-12 00:00:00*/
        var posAndVel = satellitePropagation.getPositionAndVelocity(tleLine1, tleLine2, new Date(Date.UTC(2017, 4, 12, 0, 0, 0)));
        var velocity = satellitePropagation.getVelocity(posAndVel.velocity);
        velocity.should.be.eql(7.661177463983449);
        done();
    });
});
