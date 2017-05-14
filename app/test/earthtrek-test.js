/**
 * @class EarthTrek Viewer
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 13 MAY 2017.
 */
var assert = require('assert');
var should = require('should');
var EarthTrek = require('../js/earthtrek');

describe('EarthTrek Main Class', function(){
   /* it('Get Viewer', function(done) {


        var viewer = earthTrek.getViewer("#main-container", earthTrek.getClock(Date.UTC(1998, 1, 1), Date.now(), Date.now()));
        console.log(viewer)
        done();
    });*/

    it('Init', function(done) {
        var earthTrek = new EarthTrek(Date.UTC(1998, 1, 1), Date.now(), Date.now());

        earthTrek.startTime.dayNumber.should.be.eql(2450845);
        done();
    });
});
