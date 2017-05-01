
var satellite = satellite || {};

/**
     * Show Satellite Toolbar UI
     * @param dataSource
     */
    showSatelliteToolbar = function (entity) {
        var satelliteToolbar = $('#satellite-toolbar');
        satelliteToolbar.show();
        var instruments = entity.properties.instruments.getValue();

        if (instruments.length > 0) {
            var instrumentText = document.createElement('div')
            $(instrumentText).html = "<span>INSTRUMENTOS</span>";
            $("#satellite-instruments").append(instrumentText);

            for (var i = 0; i <= instruments.length - 1; i++) {
                var instrumentName = instruments[i];
                var instrument = document.createElement('div');
                instrument.id = "satellite-instrument-" + satellite.id + "-" + instrumentName.name;
                $(instrument).addClass("satellite-instrument");
                $(instrument).html("<div>" + instrumentName.name + "</div>");
                $(instrument).data('instrument', instrumentName.name);

                var layerButton = document.createElement("button");
                $(layerButton).html("Layers");
                $(layerButton).click(showLayers);
                $(instrument).append(layerButton);

                $("#satellite-instruments").append(instrument);
            }
        }

    }

    showLayers = function (event) {
        $("#satellite-instrument-layers").empty();
        $.each(viewer.selectedEntity.properties.instruments.getValue(), function(key, instrument) {
            if (instrument.name == $(event.target.parentElement).data('instrument')) {
                $.each(instrument.layers, function(key, layer ) {

                    var instrumentLayer = document.createElement('div');
                    $(instrumentLayer).addClass("instrument-layer");
                    $(instrumentLayer).data("name", layer.name);
                    $(instrumentLayer).data("startDate", layer.startDate);
                    $(instrumentLayer).data("format", layer.format);
                    $(instrumentLayer).data("resolution", layer.resolution);

                    $(instrumentLayer).html(layer.title);

                    var toggleLayerButton = document.createElement("button");
                    $(toggleLayerButton).on('click', function () {
                        provider = getProvider(layer.name, layer.startDate, layer.format, "EPSG4326_" + layer.resolution);
                        viewer.scene.imageryLayers.addImageryProvider(provider);
                    });

                    $(toggleLayerButton).text("View");
                    $(toggleLayerButton).addClass("view");
                    $(instrumentLayer).append(toggleLayerButton);

                    var compareButton = document.createElement("button");
                    $(compareButton).html("Comparar");
                    $(compareButton).click(function () {
                        $('.compare-selected').removeClass('compare-selected');
                        $(compareButton).addClass("compare-selected");
                        $('#compare-modal').show();
                    });
                    $(instrumentLayer).append(compareButton);


                    $("#satellite-instrument-layers").append(instrumentLayer);
                });
            }
        });


        $("#accept-date").click(function () {
            if ($('#compare-date').val()) {
                var layer = {};
                layer.name = $('.compare-selected').parent().data("name");
                layer.firstDate = $('#compare-date').val();
                layer.secondDate = clock.currentTime.toString();
                layer.format = $('.compare-selected').parent().data("format");
                layer.resolution = $('.compare-selected').parent().data("resolution");

                compare(layer);
                $('#compare-modal').hide();
            }
        });
    }


    /**
     * Compare FirstView and Second View of Earth
     */
    compare = function (layer) {

        provider = getProvider(layer.name, layer.firstDate, layer.format, "EPSG4326_" + layer.resolution);
        viewer.scene.imageryLayers.addImageryProvider(provider);

        provider = getProvider(layer.name, layer.secondDate, layer.format, "EPSG4326_" + layer.resolution);
        secondView = viewer.scene.imageryLayers.addImageryProvider(provider);

        this.className = "button-selected";
        var slider = $("#slider");
        toogle(slider, function() {
            secondView.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        }, function() {
            secondView.splitDirection =  Cesium.ImageryLayer.DEFAULT_SPLIT;
        });

        referenceLayerProvider = getProvider("Reference_Labels", '2016-11-19', "image/png", "EPSG4326_250m");
        viewer.scene.imageryLayers.addImageryProvider(referenceLayerProvider);
    }