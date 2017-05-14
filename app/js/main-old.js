    var backgroundLayerProvider;
    var referenceLayerProvider;
    var previousTime;

    var initialTime = Cesium.JulianDate.fromDate(
        new Date(Date.now()));
    var startTime = Cesium.JulianDate.fromDate(
        new Date(Date.UTC(1998, 1, 1)));
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

    var viewer = new Cesium.Viewer("main-container", {
        clock: clock,
        baseLayerPicker: false, // Only showing one layer in this demo,
        requestWaterMask: true,
        automaticallyTrackDataSourceClocks: false,
        navigationHelpButton: false,
        infoBox: false
    });
    viewer.timeline.zoomTo(startTime, endTime);
    viewer.scene.globe.baseColor = Cesium.Color.BLACK;
    viewer.camera.frustum.far = 10000000000.0; //10M KM

    backgroundLayerProvider = provider.getProvider(
        "VIIRS_SNPP_CorrectedReflectance_TrueColor",
        '2016-11-21',
        "image/jpeg",
        "epsg4326",
        "250m"
    );
    viewer.scene.imageryLayers.addImageryProvider(backgroundLayerProvider);

    referenceLayerProvider = provider.getProvider(
        "Reference_Labels",
        '2016-11-19',
        "image/png",
        "epsg4326",
        "250m"
    );
    viewer.scene.imageryLayers.addImageryProvider(referenceLayerProvider);

    var onClockUpdate = _.throttle(function() {
        var isoDateTime = clock.currentTime.toString();
        var time = isoDate(isoDateTime);
        updateSatellites();
        if (time !== previousTime) {
            previousTime = time;
            updateLayers();

            if (viewer.selectedEntity != null) {
                showSatelliteToolbar(viewer.selectedEntity);
            }
        }
    });


    updateLayers = function() {
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

    viewer.clock.onTick.addEventListener(onClockUpdate);

    function toggle(div, callbackOn, callbackOff) {
        if (div.is(":visible")) {
            div.hide();
            callbackOff();
        } else  {
            div.show();
            callbackOn();
        }
    }
    $('.datepicker').datepicker();

    /**
     * LEFT TOOLBAR
     */
    $("#main-container").append(earthTrekToolbar.create("top-left-toolbar", function(toolbarContainer) {
        jQuery("#search-satellite").detach().appendTo(toolbarContainer);
    }));

    $("#main-container").append(earthTrekToolbar.create("left-toolbar", function(toolbarContainer) {

    }));

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
