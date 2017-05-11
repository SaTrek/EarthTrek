    var backgroundLayerProvider;
    var referenceLayerProvider;
    var previousTime;

    var dataSource = new Cesium.CzmlDataSource();

    var now = new Date(Date.now());
    var initialTime = Cesium.JulianDate.fromDate(now);
    var startTime = Cesium.JulianDate.fromDate(new Date(Date.UTC(2011, 1, 1)));
    var endTime = Cesium.JulianDate.fromDate(new Date(Date.UTC(2017, 4, 18)));

    var gregorianDate = Cesium.JulianDate.toGregorianDate(initialTime);
    $("#spinner-day").val(gregorianDate.day);
    $("#spinner-month").val(gregorianDate.month);
    $("#spinner-year").val(gregorianDate.year);

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

    var animationViewModel = viewer.animation.viewModel;
   // animationViewModel.dateFormatter = function() { return ''; };


    animationViewModel.timeFormatter = function(date, viewModel) {
        var gregorianDate = Cesium.JulianDate.toGregorianDate(date);
        var localTime = new Date(
            gregorianDate.year + '-' + gregorianDate.month + '-' + gregorianDate.day + ' ' +
            gregorianDate.hour + ':' + gregorianDate.minute + ':' + gregorianDate.second + ' UTC'
        );
        return Cesium.sprintf(
            "%02d:%02d:%02d",
            localTime.getHours(), localTime.getMinutes(), localTime.getSeconds()
        );
    };

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
        if (time !== previousTime) {
            viewer.dataSources.removeAll();
            dataSource
                .load('data/satellites-' + time +'.czml')
                .then(function(){
                    setSatellitesProperties()
                });
            viewer.dataSources.add(dataSource);

            previousTime = time;
            updateLayers();

            if (viewer.selectedEntity != null) {
                showSatelliteToolbar(viewer.selectedEntity );
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

    function setSatellitesProperties() {
        $.getJSON( "data/instrumentsFULL.json", function( satellites ) {
            satellites.forEach(function( sat ) {
                var entity = dataSource.entities.getById(sat.id.toLowerCase());
                if (entity != undefined) {
                    entity.properties = sat;
                    if (sat.name != undefined) {
                        entity.label.text = sat.name
                    }
                }
            });
        });
    }


    function toggle(div, callbackOn, callbackOff) {
        if (div.is(":visible")) {
            div.hide();
            callbackOff();
        } else  {
            div.show();
            callbackOn();
        }
    }

    $('#select-date-button').click(function () {
       // $('#selected-date-modal').show();

        viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date(Date.UTC(
            $("#spinner-year").val(),
            $("#spinner-month").val() - 1,
            $("#spinner-day").val()
        )));
    });
    
    $("#spinner-year").change(function (text) {
        console.log(text)
    })


    $('.datepicker').datepicker();


    /**
     * LEFT TOOLBAR
     */
    $("#main-container").append(earthTrekToolbar.create("top-left-toolbar", function(toolbarContainer) {

        jQuery("#search-satellite").detach().appendTo(toolbarContainer);
    }));
    $("#main-container").append(earthTrekToolbar.create("left-toolbar", function(toolbarContainer) {
        $.getJSON( "data/instrumentsFULL.json", function( satellites ) {
            satellites.forEach(function( sat ) {
                if (sat.status == "ACTIVE") {

                    var satelliteContainer = document.createElement('div');

                    var satelliteImage = document.createElement('img');
                    $(satelliteImage).attr("src", 'images/satellites/'+ sat.image);
                    $(satelliteContainer).append(satelliteImage);
                    $(satelliteContainer).click(function() {
                        var selected = gotoSatellite(dataSource.entities.getById(sat.id.toLowerCase()));
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

            });

            $(toolbarContainer).slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                variableWidth: true
            });
        });
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
