/**
 * Created by AlexSnipes on 5/12/17.
 */
var assert = require('assert');
var should = require('should');
var satellitePropagation = require('../js/satellite-propagation');

describe('Propagate Satellite', function(){
    it('get satellite position by two different dates using one TLE', function(done) {

        /** ISS TLE*/
        var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
            tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';

        /** Check Date 2017-05-12 00:00:00*/
        var satellitePos = satellitePropagation.getPosition(tleLine1, tleLine2, new Date(2017, 4, 12, 0, 0, 0));

        satellitePos.longitude.should.be.eql(143.43548016972008);
        satellitePos.latitude.should.be.eql(-23.942930930599395);
        satellitePos.height.should.be.eql(410141.2875273854);

        /** Check Date 2017-05-13 00:00:00*/
        var satellitePos = satellitePropagation.getPosition(tleLine1, tleLine2, new Date(2017, 4, 13, 0, 0, 0));

        satellitePos.longitude.should.be.eql(-27.504535445577233);
        satellitePos.latitude.should.be.eql(36.4127912869102);
        satellitePos.height.should.be.eql(408469.7805441565);
        done();
    });

    it('get satellite position by two different dates using two TLE', function(done) {

        /** ISS TLE EPOCH: 17132.53751028*/
        var tleLine1 = '1 25544U 98067A   17132.53751028  .00016717  00000-0  10270-3 0  9035',
            tleLine2 = '2 25544  51.6411 216.0049 0005344 152.4463 207.6974 15.54000018 16201';

        /** Check Date 2017-05-12 00:00:00*/
        var satellitePos = satellitePropagation.getPosition(tleLine1, tleLine2, new Date(2017, 4, 12, 0, 0, 0));

        satellitePos.longitude.should.be.eql(143.44707922326015);
        satellitePos.latitude.should.be.eql(-23.954852955824443);
        satellitePos.height.should.be.eql(409991.05169310863);

        /** Check Date 2017-05-13 00:00:00*/
        /** ISS TLE EPOCH: 17133.30919458*/
        var tleLine1 = '1 25544U 98067A   17133.30919458  .00016717  00000-0  10270-3 0  9045',
            tleLine2 = '2 25544  51.6386 212.1565 0005483 154.1122 206.0305 15.54010446 16327';
        var satellitePos = satellitePropagation.getPosition(tleLine1, tleLine2, new Date(2017, 4, 13, 0, 0, 0));

        satellitePos.longitude.should.be.eql(-27.576061043476614);
        satellitePos.latitude.should.be.eql(36.36310186670732);
        satellitePos.height.should.be.eql(408652.2234890026);
        done();
    });

    it('get satellite velocity magnitude in KM/s', function(done) {

        /** ISS TLE*/
        var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
            tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';

        /** Check Date 2017-05-12 00:00:00*/
        var velocity = satellitePropagation.getVelocity(tleLine1, tleLine2, new Date(2017, 4, 12, 0, 0, 0));

        velocity.should.be.eql(7.665749935044733);
        done();
    });
});
