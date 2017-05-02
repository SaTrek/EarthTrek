/**
 * Created by Alex on 01/05/2017.
 */

var propagate = propagate || {};

var tleLine1 = '1 25544U 98067A   13149.87225694  .00009369  00000-0  16828-3 0  9031',
    tleLine2 = '2 25544 051.6485 199.1576 0010128 012.7275 352.5669 15.50581403831869';

// Initialize a satellite record
var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

var positionAndVelocity = satellite.propagate(satrec, new Date());
// The position_velocity result is a key-value pair of ECI coordinates.
// These are the base results from which all other coordinates are derived.
var positionEci = positionAndVelocity.position,
    velocityEci = positionAndVelocity.velocity;

console.log(positionEci, velocityEci);

// Set the Observer at 122.03 West by 36.96 North, in RADIANS
var observerGd = {
    longitude: -122.0308 * deg2rad,
    latitude: 36.9613422 * deg2rad,
    height: 0.370
};

//  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W", etc).
var longitudeStr = satellite.degreesLong(longitude),
    latitudeStr  = satellite.degreesLat(latitude);