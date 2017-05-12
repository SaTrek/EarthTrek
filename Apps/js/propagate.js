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

    console.log(positionGd)
    var pos = Math.sqrt(Math.pow(positionEci.x, 2) + Math.pow(positionEci.y, 2) + Math.pow(positionEci.z, 2));
    var vel = Math.sqrt(Math.pow(velocityEci.x, 2) + Math.pow(velocityEci.y, 2) + Math.pow(velocityEci.z, 2));
    return positionGd;
}




var entities = [];
createModel('models/iss.glb');

function calculatePositionSamples(point, endPoint, startTime, duration, intervalCount) {
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
    console.log(property)
    return property;
}
function createModel(url) {
  //  viewer.entities.removeAll();

    //var position = Cesium.Cartesian3.fromDegrees(307.56125, -47.846016, height);
    //  var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    //  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    // var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    var duration = 5400; //seconds
    var frequency = 10; //hertz

    var tleLine1 = '1 25544U 98067A   17131.18705992  .00016717  00000-0  10270-3 0  9012',
        tleLine2 = '2 25544  51.6417 222.7377 0004959 146.1861 213.9609 15.53995368 15998';

    var point = getPosition(tleLine1, tleLine2, new Date())

    var tleLine1 = '1 25544U 98067A   17132.15166687  .00016717  00000-0  10270-3 0  9023',
        tleLine2 = '2 25544  51.6405 217.9287 0004884 149.5686 210.5751 15.54020107 16140';

    lastDate =  new Date();
    lastDate.setSeconds(lastDate.getSeconds() + duration);
    console.log(lastDate.toISOString())
    var finalPoint = getPosition(tleLine1, tleLine2, lastDate)

    var start = Cesium.JulianDate.fromDate(new Date());
    var stop = Cesium.JulianDate.addSeconds(start, duration, new Cesium.JulianDate());
    var positions = calculatePositionSamples(point, finalPoint, start, duration, frequency);


     var entity = viewer.entities.add({
        name : 'ISS',
        position : positions,
        orientation: new Cesium.VelocityOrientationProperty(positions),
        model : {
            uri : url,
            minimumPixelSize : 528,
            maximumScale : 200
        },
        path: {
            resolution: 2,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: Cesium.Color.RED
            }),
            width: 5,
            trailTime: duration,
            leadTime: 0
        }
    });
    entities.push(entity);
   viewer.trackedEntity = entity;
}

updateSatellites = function () {
    entities.forEach(function( entity ) {

    });
}
