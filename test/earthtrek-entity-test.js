/**
 * @class EarthTrekEntityTest
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 25 JUN 2017.
 */
const assert = require('assert');
const should = require('should');
const JulianDate = require('cesium/Source/Core/JulianDate');
const EarthTrekEntity = require('../src/js/earthtrek-entity');
const fs = require('fs');
describe('EarthTrek Entity', function(){
    it('Add Entity', function(done) {
        var currentDate = new Date(Date.UTC(2017, 4, 12, 0, 0, 0));
        var julianDate = JulianDate.fromDate(currentDate);
        const satelliteData = (JSON.parse(fs.readFileSync('./test/data/iss.json', "utf8")));
        const entity = new EarthTrekEntity(satelliteData, julianDate).getEntityData();

        entity.name.should.be.eql(satelliteData.name);
        entity.position.should.not.empty();
        done();
    });
});