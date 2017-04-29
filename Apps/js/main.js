
    //$('#satellite-toolbar').draggable();
    // Initially start at June 15, 2014
    var initialTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(2012, 02, 7)));

    // Earliest date of Corrected Reflectance in archive: May 8, 2012
    var startTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(2012, 02, 7)));

    var endTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(2017, 05, 18)));

    var clock = new Cesium.Clock({
        startTime: startTime,
        endTime: endTime,
        currentTime: initialTime,
        multiplier: 0,   // Don't start animation by default
      //  clockRange: Cesium.ClockRange.CLAMPED,
        clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
    });

    // Keep track of the previous day. Only update the layer on a tick if the
    // day has actually changed.
    // GIBS needs the day as a string parameter in the form of YYYY-MM-DD.
    // Date.toISOString returns YYYY-MM-DDTHH:MM:SSZ. Split at the "T" and
    // take the date which is the first part.
    var isoDate = function(isoDateTime) {
        return isoDateTime.split("T")[0];
    };
    // Current layer being shown
    var dailyProvider = null;



    var viewer = new Cesium.Viewer("map", {
        clock: clock,
        baseLayerPicker: false, // Only showing one layer in this demo,
        requestWaterMask: true,
      //  infoBox: false
   //     imageryProvider: createDailyProvider()
    });

    var layers = viewer.imageryLayers;

    var time = "TIME=" + isoDate('2012-02-07');
    var provider = new Cesium.WebMapTileServiceImageryProvider({
        url: "//gibs-c.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?" + time,
        layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
        style: "",
        format: "image/jpeg",
        tileMatrixSetID: "EPSG4326_250m",
        maximumLevel: 8,
        tileWidth: 256,
        tileHeight: 256,
        tilingScheme: gibs.GeographicTilingScheme()
    });
    var firstView = viewer.scene.imageryLayers.addImageryProvider(provider);

    var time = "TIME=" + isoDate('2015-10-18');
    var provider = new Cesium.WebMapTileServiceImageryProvider({
        url: "//gibs-c.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?" + time,
        layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
        style: "",
        format: "image/jpeg",
        tileMatrixSetID: "EPSG4326_250m",
        maximumLevel: 8,
        tileWidth: 256,
        tileHeight: 256,
        tilingScheme: gibs.GeographicTilingScheme()
    });
    var secondView = viewer.scene.imageryLayers.addImageryProvider(provider);


     //REFERENCE
    var provider = new Cesium.WebMapTileServiceImageryProvider({
        url: "//gibs-c.earthdata.nasa.gov/wmts/epsg4326/best/wmts.cgi?" + time,
        layer: "Reference_Labels",
        style: "",
        format: "image/png",
        tileMatrixSetID: "EPSG4326_250m",
        maximumLevel: 8,
        tileWidth: 256,
        tileHeight: 256,
        tilingScheme: gibs.GeographicTilingScheme()
    });
    viewer.scene.imageryLayers.addImageryProvider(provider);

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    /**
     * DATA SOURCE
     */
    var satellitesData;
    var dataSource = new Cesium.CzmlDataSource();
    dataSource.load('data/satellites-2017-04-27.czml').then(function(){
        $.getJSON( "data/instruments.json", function( data ) {
            satellitesData = data;
        }).done(function(data) {
            $.each(data.satellites, function( key, satellite  ) {
                var entity = dataSource.entities.getById(satellite.id);
                if (entity != undefined) {
                    entity.properties = satellite;
                }
            });
        });
    });
    viewer.dataSources.add(dataSource);

    var previousTime = null;

    handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        var satelliteToolbar = document.getElementById('satellite-toolbar');
        document.getElementById("satellite-instruments").innerHTML = "";
        if (Cesium.defined(pick) && Cesium.defined(pick.node) && Cesium.defined(pick.mesh)) {
            var entity = dataSource.entities.getById(pick.id._id);
            if (entity != undefined) {
                showSatelliteToolbar(entity, satellitesData);
            }
        } else {
            viewer.trackedEntity = undefined;
            satelliteToolbar.style.display = "none";
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    function toogle(div, callbackOn, callbackOff) {
        if (div.style.display == "block") {
            div.style.display = "none";
            callbackOff();
        } else  {
            div.style.display = "block";
            callbackOn();
        }
    }

    viewer.timeline.zoomTo(startTime, endTime);
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;

    var onClockUpdate = _.throttle(function() {
        var isoDateTime = clock.currentTime.toString();
        var time = isoDate(isoDateTime);
        if ( time !== previousTime ) {
            viewer.dataSources.removeAll();
            var dataSource = new Cesium.CzmlDataSource();

            dataSource.load('data/satellites-' + time +'.czml').then(function(){
                $.getJSON( "data/instruments.json", function( data ) {
                    satellitesData = data;
                }).done(function(data) {
                    $.each(data.satellites, function( key, satellite  ) {
                        var entity = dataSource.entities.getById(satellite.id);
                        if (entity != undefined) {
                            entity.properties = satellite;
                        }
                    });
                });
            });
            viewer.dataSources.add(dataSource);
          /*  if (!viewer.dataSources.contains(dataSource)) {
                console.log(viewer.dataSources.contains(dataSource))
                viewer.dataSources.add(dataSource);
            }
            */

            previousTime = time;
            viewer.scene.imageryLayers.removeAll();

            var time = "TIME=" + isoDate('2016-11-18');

            // Day of the imagery to display is appended to the imagery
            // provider URL
            var provider = new Cesium.WebMapTileServiceImageryProvider({
                url: "//map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?" + time,
                layer: "VIIRS_SNPP_CorrectedReflectance_TrueColor",
                style: "",
                format: "image/jpeg",
                tileMatrixSetID: "EPSG4326_250m",
                maximumLevel: 12,
                tileWidth: 256,
                tileHeight: 256,
                tilingScheme: gibs.GeographicTilingScheme()
            });

            viewer.scene.imageryLayers.addImageryProvider(provider);
        }
    });

    viewer.clock.onTick.addEventListener(onClockUpdate);

    /**
     * SLIDER
     */

// Sync the position of the slider with the split position
    var slider = document.getElementById('slider');
    viewer.scene.imagerySplitPosition = (slider.offsetLeft) / slider.parentElement.offsetWidth;

    var dragStartX = 0;
    document.getElementById('slider').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

    function mouseUp() {
        window.removeEventListener('mousemove', sliderMove, true);
    }

    function mouseDown(e) {
        var slider = document.getElementById('slider');
        dragStartX = e.clientX - slider.offsetLeft;
        window.addEventListener('mousemove', sliderMove, true);
    }

    function sliderMove(e) {
        var slider = document.getElementById('slider');
        var splitPosition = (e.clientX - dragStartX) / slider.parentElement.offsetWidth;
        slider.style.left = 100.0 * splitPosition + "%";
        viewer.scene.imagerySplitPosition = splitPosition;
    }
