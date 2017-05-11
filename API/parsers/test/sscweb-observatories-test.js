/**
 * Created by alex on 5/11/17.
 */
var assert = require('assert'),  should = require('should');
var sscWeb = require('../sscweb-parser');

describe('SSCWeb', function(){
    it('can get observatories', function(done) {

        this.timeout(10000);
        var satsId = ["aqua", "aura", "calipso", "cloudsat", "dscovr", 'iss', "jason2", "kepler", "suomi", "terra", "trmm", "landsat", "grace1", "grace2", "icesat", "sorce", "quikscat", "smap", "gpm", "sac-d", "trace", "spitzer", "GCOM-W1", "oco2"]

        sscWeb.getObservatories(satsId, function(err, result) {
            result.should.not.be.empty;
            done();
        });
    });
});