var propagate = propagate || {};

getPosition = function(tleLine1, tleLine2, date) {
    var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

    var positionAndVelocity = satellite.propagate(satrec, date);
    var positionEci = positionAndVelocity.position;

    var now = date;
    var gmst = satellite.gstimeFromDate(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );

    var positionGd    = satellite.eciToGeodetic(positionEci, gmst);
    var longitude = positionGd.longitude,
        latitude  = positionGd.latitude;

    var longitudeStr = satellite.degreesLong(longitude);
    var latitudeStr  = satellite.degreesLat(latitude);

    positionGd.longitude = longitudeStr;
    positionGd.latitude = latitudeStr;
    positionGd.height = positionGd.height * 1000;
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
    var duration = 7200; //seconds
    var frequency = 50; //hertz
    var color = Cesium.Color.fromRandom({
        minimumRed : 0.35,
        minimumGreen : 0.15,
        minimumBlue : 0.45,
        alpha : 1.0
    });

    if (satelliteInfo.tle == undefined) {
        return false;
    }
    var positions = calculatePositionSamples(satelliteInfo.tle.line1, satelliteInfo.tle.line2, start, duration, frequency);


     var entity = viewer.entities.add({
        id: satelliteInfo.id,
        name : satelliteInfo.name,
        position : positions,
        orientation: new Cesium.VelocityOrientationProperty(positions),
        model : {
            uri : 'models/' + satelliteInfo.id + '.glb',
            minimumPixelSize : 50,
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
            scale: 0.5,
            scaleByDistance: new Cesium.NearFarScalar(0, 1.5, 15.0e6, 0.85),
            fillColor : Cesium.Color.WHITE,
            eyeOffset: new Cesium.Cartesian3(0.0, 5.0, 100.0),
            outlineColor: color,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset:  new Cesium.Cartesian2(0, -15)
        },
         billboard: {
             image  : 'images/satellites/' + satelliteInfo.image,
             distanceDisplayCondition: new Cesium.DistanceDisplayCondition(50000.1, 150000000.0),
             scale: 0.35
         },
        properties: satelliteInfo
    });

    var timeInterval = new Cesium.TimeInterval({
        start : Cesium.JulianDate.fromIso8601(satelliteInfo.launchDate),
        stop : Cesium.JulianDate.fromIso8601("2099-01-01"),
        isStartIncluded : true,
        isStopIncluded : false
    });

    if (satelliteInfo.endDate != null ) {
        timeInterval.stop = Cesium.JulianDate.fromIso8601(satelliteInfo.endDate);
        timeInterval.isStopIncluded = true;
    }
    var intervalCollection = new Cesium.TimeIntervalCollection();
    intervalCollection.addInterval(timeInterval);
    entity.availability = intervalCollection;
    entities.push(entity);
}

createEntities = function() {
    $.getJSON( "data/instruments.json", function( satellites ) {
        var toolbarContainer = $("#left-toolbar");
        satellites.forEach(function( satelliteInfo ) {
            var entity = viewer.entities.getById(satelliteInfo.id);
            if (entity == null && satelliteInfo.status == 'ACTIVE' ) {
                createEntity(satelliteInfo, clock.currentTime);
                addSatelliteToToolbar(satelliteInfo, toolbarContainer);
            }
        });

        $(toolbarContainer).slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            variableWidth: true
        });
    });
}

addSatelliteToToolbar = function (sat, toolbarContainer) {
    var satelliteContainer = document.createElement('div');

    var satelliteImage = document.createElement('img');
    $(satelliteImage).attr("src", 'images/satellites/' + sat.image)
    $(satelliteContainer).append(satelliteImage);
    $(satelliteContainer).click(function() {
        var selected = gotoSatellite(viewer.entities.getById(sat.id.toLowerCase()));
        if (selected == true) {
            $(".satellite-selected").removeClass("satellite-selected");
            $(satelliteContainer).addClass("satellite-selected");
        }
    });
    $(satelliteContainer).popover({
        trigger: 'hover',
        title: sat.name,
        content: sat.description,
        placement: 'bottom',
        container: "#left-toolbar"
    });
    $(toolbarContainer).append(satelliteContainer);
}

createEntities();

updateSatellites = function () {
    var duration = 7200; //seconds
    var frequency = 50; //hertz

    if (Cesium.JulianDate.secondsDifference(clock.currentTime, start) > duration ||
        Cesium.JulianDate.secondsDifference(start, clock.currentTime) > duration ) {
        start = clock.currentTime;
        entities.forEach(function( entity ) {
            var newStart = clock.currentTime;
            var positions = calculatePositionSamples(entity.properties.getValue().tle.line1, entity.properties.getValue().tle.line2, newStart, duration, frequency);
            entity.position = positions;
        });
    }
}