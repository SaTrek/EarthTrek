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
var start = clock.currentTime;

function calculatePositionSamples(tleLine1, tleLine2, startTime, duration, intervalCount) {
    var property = new Cesium.SampledPositionProperty();


    var previousDuration = duration;
    var deltaStep = previousDuration / (intervalCount > 0 ? intervalCount : 1);
    var previousTime = new Date(Cesium.JulianDate.toIso8601(startTime));
    previousTime.setSeconds(previousTime.getSeconds() - previousDuration);
    var previousTimeJulian = Cesium.JulianDate.fromDate(previousTime);

    for (var since = 0; since <= previousDuration; since += deltaStep) {
        previousTime.setSeconds(previousTime.getSeconds() + deltaStep)
        var newPosition = getPosition(tleLine1, tleLine2, previousTime);
        property.addSample(
            Cesium.JulianDate.addSeconds(previousTimeJulian, since, new Cesium.JulianDate()),
            Cesium.Cartesian3.fromDegrees(newPosition.longitude, newPosition.latitude, newPosition.height)

        );
    }


    var deltaStep = duration / (intervalCount > 0 ? intervalCount : 1);
    var date = new Date(Cesium.JulianDate.toIso8601(startTime));
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

function createEntity(satelliteInfo, start) {
  //  viewer.entities.removeAll();

    //var position = Cesium.Cartesian3.fromDegrees(307.56125, -47.846016, height);
    //  var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    //  var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    // var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);

    var duration = 7200; //seconds
    var frequency = 50; //hertz
    var color = Cesium.Color.fromRandom({
        minimumRed : 0.35,
        minimumGreen : 0.15,
        minimumBlue : 0.45,
        alpha : 1.0
    });
    if (satelliteInfo.orbitalData == undefined) {
        return false;
    }
    var positions = calculatePositionSamples(satelliteInfo.tle.line1, satelliteInfo.tle.line2, start, duration, frequency);

    var url =  'models/' + satelliteInfo.id + '.glb';
     var entity = viewer.entities.add({
        id: satelliteInfo.id,
        name : satelliteInfo.name,
        position : positions,
        orientation: new Cesium.VelocityOrientationProperty(positions),
        model : {
            uri : url,
            minimumPixelSize : 512,
            maximumScale : 1,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 50000.0)
        },
        path: {
            resolution: 5,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.2,
                color: color
            }),
            width: 7,
            trailTime: duration,
            leadTime: 0
        },
        label: {
            show: true,
            text: satelliteInfo.name,
            scale: 0.7,
          //  scaleByDistance: new Cesium.NearFarScalar(0, 1.5, 8.0e6, 0.5),
            fillColor : Cesium.Color.WHITE,
            eyeOffset: new Cesium.Cartesian3(0.0, 5.0, 100.0),
            outlineColor: color,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE
        },
         billboard: {
             image  : 'images/satellites/' + satelliteInfo.id + '.png',
             distanceDisplayCondition: new Cesium.DistanceDisplayCondition(50000.1, 150000000.0),
             scale: 0.3
         },
        properties: satelliteInfo
    });
    entities.push(entity);
}

createEntities = function(time) {
    $.getJSON( "data/instrumentsFULL.json", function( satellites ) {
        satellites.forEach(function( satelliteInfo ) {
            var entity = viewer.entities.getById(satelliteInfo.id);
            if (entity == null && satelliteInfo.status == 'ACTIVE' && time >= satelliteInfo.launchDate && (satelliteInfo.endDate == null || time < satelliteInfo.endDate) ) {
                createEntity(satelliteInfo, start);
            }
        });
    });
}

updateSatellites = function () {
    var duration = 7200;

    var isoDateTime = clock.currentTime.toString();
    var time = isoDate(isoDateTime);
    if (time !== previousTime) {
        previousTime = time;

        /**
         * CREATE
         */
        createEntities(time);

        /**
         * REMOVE
         */
        entities.forEach(function( entity ) {
            if (time < entity.properties.launchDate || time >= entity.properties.endDate) {
                console.log("Removió");
                viewer.entities.remove(entity);
            }
        });
    }

    if (Cesium.JulianDate.secondsDifference(clock.currentTime, start) > duration ||
        Cesium.JulianDate.secondsDifference(start, clock.currentTime) > duration ) {
        start = clock.currentTime;
        entities.forEach(function( entity ) {
            var duration = 7200; //seconds
            var frequency = 50; //hertz

            var newStart = clock.currentTime;
            var positions = calculatePositionSamples(entity.properties.getValue().tle.line1, entity.properties.getValue().tle.line2, newStart, duration, frequency);
            entity.position = positions;
            console.log("PROPAGO")
        });
    }
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
