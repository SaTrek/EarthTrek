    var backgroundLayerProvider;
    var referenceLayerProvider;
    $('.datepicker').datepicker();

    var initialTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(2017, 4, 2)));

    var startTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(2011, 1, 1)));

    var endTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(2017, 4, 18)));

    var clock = new Cesium.Clock({
        startTime: startTime,
        endTime: endTime,
        currentTime: initialTime,
        multiplier: 10,
        clockStep : Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER
    });
    var isoDate = function(isoDateTime) {
        return isoDateTime.split("T")[0];
    };
    var viewer = new Cesium.Viewer("map", {
        clock: clock,
        baseLayerPicker: false, // Only showing one layer in this demo,
        requestWaterMask: true,
        automaticallyTrackDataSourceClocks: false,
        navigationHelpButton: false,
        infoBox: false
    });

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    /**
     * DATA SOURCE
     */
   // var getDataSource = function () {
        var satellitesData;
        var dataSource = new Cesium.CzmlDataSource();
        var isoDateTime = clock.currentTime.toString();
        var time = isoDate(isoDateTime);
        dataSource
            .load('data/satellites-' + time +'.czml')
            .then(function(){
                $.getJSON( "data/instrumentsFULL.json", function( data ) {
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
   // }

    viewer.dataSources.add(dataSource);

    var previousTime = null;

    handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        var satelliteToolbar = $('#satellite-toolbar');
        $("#satellite-instruments").empty();

        if (Cesium.defined(pick)) {
            var entity = dataSource.entities.getById(pick.id._id);
            if (entity != undefined) {
                // && Cesium.defined(pick.node) && Cesium.defined(pick.mesh)
                showSatelliteToolbar(entity);
            }
        } else  {
            viewer.trackedEntity = undefined;
            satelliteToolbar.hide();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    var toogle = function(div, callbackOn, callbackOff) {
        if (div.is(":visible")) {
            div.hide();
            callbackOff();
        } else  {
            div.show();
            callbackOn();
        }
    }

    viewer.timeline.zoomTo(startTime, endTime);
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;

    var setSatellitesProperties = function(dataSource) {
        $.getJSON( "data/instrumentsFULL.json", function( data ) {
            satellitesData = data;
        }).done(function(data) {
            $.each(data.satellites, function( key, satellite  ) {
                var entity = dataSource.entities.getById(satellite.id);
                if (entity != undefined) {
                    entity.properties = satellite;
                }
            });
        });
    }
    /*
    polarBackgroundLayerProvider = provider.getProvider(
        "VIIRS_SNPP_CorrectedReflectance_TrueColor",
        '2016-11-30',
        "image/jpeg",
        "epsg3413",
        "250m"
    );
    viewer.scene.imageryLayers.addImageryProvider(polarBackgroundLayerProvider);
*/
    backgroundLayerProvider = provider.getProvider(
        "VIIRS_SNPP_CorrectedReflectance_TrueColor",
        '2016-11-21',
        "image/jpeg",
        "epsg4326",
        "250m"
    );
    viewer.scene.imageryLayers.addImageryProvider(backgroundLayerProvider);


    referenceLayerProvider = provider.getProvider("Reference_Labels", '2016-11-19', "image/png", "epsg4326", "250m");
    viewer.scene.imageryLayers.addImageryProvider(referenceLayerProvider);

    var onClockUpdate = _.throttle(function() {
        var isoDateTime = clock.currentTime.toString();
        var time = isoDate(isoDateTime);
        if (time !== previousTime) {
            viewer.dataSources.removeAll();
            var dataSource = new Cesium.CzmlDataSource();
            dataSource
                .load('data/satellites-' + time +'.czml')
                .then(function(){
                    setSatellitesProperties(dataSource);
                });
            viewer.dataSources.add(dataSource);

            previousTime = time;
            for (var i = 0; i <= viewer.scene.imageryLayers.length - 1; i++) {
                var layer = viewer.scene.imageryLayers.get(i);
                if (layer.imageryProvider != backgroundLayerProvider) {
                    viewer.scene.imageryLayers.remove(layer);
                }
            }
            if (backgroundLayerProvider == undefined){
                backgroundLayerProvider = provider.getProvider(
                    "VIIRS_SNPP_CorrectedReflectance_TrueColor",
                    '2016-11-19',
                    "image/jpeg",
                    "epsg4326",
                    "250m"
                );
                viewer.scene.imageryLayers.addImageryProvider(backgroundLayerProvider);
            }

             referenceLayerProvider = provider.getProvider(
                 "Reference_Labels",
                 '2016-11-19',
                 "image/png",
                 "epsg4326",
                 "250m"
             );
             viewer.scene.imageryLayers.addImageryProvider(referenceLayerProvider);
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
