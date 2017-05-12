/**
 * Created by Alex on 01/05/2017.
 */

var propagate = propagate || {};

getPosition = function(tleLine1, tleLine2, date) {
    // Initialize a satellite record
    var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    var positionAndVelocity = satellite.propagate(satrec, date);
    // The position_velocity result is a key-value pair of ECI coordinates.
    // These are the base results from which all other coordinates are derived.
    var positionEci = positionAndVelocity.position,
        velocityEci = positionAndVelocity.velocity;

    var deg2rad = 0.0174533 ;
    // Set the Observer at 122.03 West by 36.96 North, in RADIANS
    /*var observerGd = {
        longitude: -122.0308 * deg2rad,
        latitude: 36.9613422 * deg2rad,
        height: 0.370
    };*/
    var now = date;
    // You will need GMST for some of the coordinate transforms.
    // http://en.wikipedia.org/wiki/Sidereal_time#Definition
    // NOTE: GMST, though a measure of time, is defined as an angle in radians.
    // Also, be aware that the month range is 1-12, not 0-11.
    var gmst = satellite.gstimeFromDate(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );

    // You can get ECF, Geodetic, Look Angles, and Doppler Factor.
    var positionEcf   = satellite.eciToEcf(positionEci, gmst);
       // observerEcf   = satellite.geodeticToEcf(observerGd),
    var   positionGd    = satellite.eciToGeodetic(positionEci, gmst);
       // lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf) ;
    // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
    var longitude = positionGd.longitude,
        latitude  = positionGd.latitude,
        height    = positionGd.height;
    //  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W". etc).
    var longitudeStr = satellite.degreesLong(longitude),
        latitudeStr  = satellite.degreesLat(latitude);
    positionGd.longitude = longitudeStr;
    positionGd.latitude = latitudeStr;
    positionGd.height = positionGd.height * 1000;

    var pos = Math.sqrt(Math.pow(positionEci.x, 2) + Math.pow(positionEci.y, 2) + Math.pow(positionEci.z, 2));
    var vel = Math.sqrt(Math.pow(velocityEci.x, 2) + Math.pow(velocityEci.y, 2) + Math.pow(velocityEci.z, 2));
    return positionGd;
}

var entities = [];
var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
    tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';
createModel('iss', 'ISS', 'models/iss.glb', tleLine1, tleLine2, Cesium.Color.RED);


var tleLine1 = '1 27424U 02022A   17131.91562854  .00000110  00000-0  34384-4 0  9996',
    tleLine2 = '2 27424  98.2026  73.7533 0000860 153.0401 299.1971 14.57109646798942';

createModel('aqua', 'Aqua', 'models/aqua.glb', tleLine1, tleLine2, Cesium.Color.GREEN);

var tleLine1 = '1 25994U 99068A   17131.81002569  .00000307  00000-0  78120-4 0  9997',
    tleLine2 = '2 25994  98.2120 207.3714 0001359 116.9424 243.1898 14.57112580925377';

createModel('terra', 'Terra', 'models/aqua.glb', tleLine1, tleLine2, Cesium.Color.BLUE);


var tleLine1 = '1 37673U 11024A   11161.63936538 -.00000050  00000-0  00000+0 0    16',
    tleLine2 = '2 37673  98.0125 168.6228 0002456 212.6674 147.5382 14.72830191    07';

createModel('sacd', 'SAC-D', 'models/sacd.glb', tleLine1, tleLine2, Cesium.Color.YELLOW);

setSatellitesProperties();

function calculatePositionSamples(tleLine1, tleLine2, startTime, duration, intervalCount) {
    var property = new Cesium.SampledPositionProperty();
    var deltaStep = duration / (intervalCount > 0 ? intervalCount : 1);

    var date = new Date();
    for (var since = 0; since <= duration; since += deltaStep) {
        date.setSeconds(date.getSeconds() + deltaStep)
        var newPosition = getPosition(tleLine1, tleLine2, date);
        property.addSample(
            Cesium.JulianDate.addSeconds(startTime, since, new Cesium.JulianDate()),
            Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, newPosition.height)

        );
    }
    return property;
}

function createModel(id, name, url, tleLine1, tleLine2, color) {
  //  viewer.entities.removeAll();

    //var position = Cesium.Cartesian3.fromDegrees(307.56125, -47.846016, height);
    //  var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    //  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    // var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    var duration = 6400; //seconds
    var frequency = 50; //hertz

    var start = Cesium.JulianDate.fromDate(new Date());
    var stop = Cesium.JulianDate.addSeconds(start, duration, new Cesium.JulianDate());
    var positions = calculatePositionSamples(tleLine1, tleLine2, start, duration, frequency);

 //   var point = getPosition(tleLine1, tleLine2, new Date())



  //  lastDate =  new Date(2017, 4, 12, 14, 40, 0);
//    var finalPoint = getPosition(tleLine1, tleLine2, lastDate)


    //  var positions = calculatePositionSamplesOriginal(point, finalPoint, start, duration, frequency);

     var entity = viewer.entities.add({
        id: id,
        name : name,
        position : positions,
        orientation: new Cesium.VelocityOrientationProperty(positions),
        model : {
            uri : url,
            minimumPixelSize : 512,
            maximumScale : 1
        },
        path: {
            resolution: 2,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: color
            }),
            width: 7,
            trailTime: duration,
            leadTime: 0
        },
        label: {
            show: true, text: name
        }
    });
    entities.push(entity);
 //  viewer.trackedEntity = entity;
}

updateSatellites = function () {
    entities.forEach(function( entity ) {

    });
}


function calculatePositionSamplesOriginal(point, endPoint, startTime, duration, intervalCount) {
    var property = new Cesium.SampledPositionProperty();
    var deltaStep = duration / (intervalCount > 0 ? intervalCount : 1);

    var delta = {
        longitude: (endPoint.longitude - point.longitude) / intervalCount,
        latitude: (endPoint.latitude - point.latitude) / intervalCount,
        height: (endPoint.height - point.height) / intervalCount
    };

    for (var since = 0; since <= duration; since += deltaStep) {
        property.addSample(
            Cesium.JulianDate.addSeconds(startTime, since, new Cesium.JulianDate()),
            Cesium.Cartesian3.fromDegrees(point.longitude += delta.longitude, point.latitude += delta.latitude, point.height += delta.height)
        );
    }
    return property;
}
