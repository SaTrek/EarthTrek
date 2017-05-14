
//var satellite = satellite || {};

    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (movement) {
        var pick = viewer.scene.pick(movement.position);
        var satelliteToolbar = $('#satellite-toolbar');
        $("#satellite-instruments").empty();

        if (Cesium.defined(pick)) {
            var entity = viewer.entities.getById(pick.id._id);
            if (entity != undefined) {
                // && Cesium.defined(pick.node) && Cesium.defined(pick.mesh)
                showSatelliteToolbar(entity);
            }
        } else  {
            viewer.trackedEntity = undefined;
            satelliteToolbar.hide();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    /**
     * Show Satellite Toolbar UI
     * @param dataSource
     */
    showSatelliteToolbar = function (entity) {
        $('#satellite-info').empty();
        $('#satellite-instruments').empty();
        var satelliteToolbar = $('#satellite-toolbar');
        if (entity.properties == undefined) {
            satelliteToolbar.hide();
            return false;
        }
        $('#satellite-name').html(entity.properties.name.getValue());

        var orbitalDataContainer = document.createElement('div');
        $.each(entity.properties.orbitalData.getValue(), function(key, value) {
            var orbitalDataKey = document.createElement('div');
            $(orbitalDataKey).append(key);
            $(orbitalDataContainer).append(orbitalDataKey);

            var orbitalDataValue = document.createElement('div');
            $(orbitalDataValue).append(value);
            $(orbitalDataContainer).append(orbitalDataValue);
        });
        $('#satellite-info').append(orbitalDataContainer);

        var instruments = entity.properties.instruments.getValue();

        if (instruments.length > 0) {
            satelliteToolbar.show();
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
                $(layerButton).click(showLayers);
                $(instrument).append(layerButton);

                $("#satellite-instruments").append(instrument);
            }
        } else {
            satelliteToolbar.hide();
        }
    }

    showLayers = function (event) {
        $('.satellite-instrument .selected').removeClass('selected');
        $(this).addClass("selected");
        $("#satellite-instrument-layers").empty();
        $.each(viewer.selectedEntity.properties.instruments.getValue(), function(key, instrument) {
            if (instrument.name == $(event.target.parentElement).data('instrument')) {
                $.each(instrument.layers, function(key, layer ) {
                    var instrumentLayer = createLayer(layer);
                    $("#satellite-instrument-layers").append(instrumentLayer).show();
                });
            }
        });

        $("#accept-date").click(function () {
            if ($('#compare-date').val()) {
                var layer = {};
                layer.id = $('.compare-selected').parent().data("id");
                layer.firstDate = $('#compare-date').val();
                layer.secondDate = clock.currentTime.toString();
                layer.format = $('.compare-selected').parent().data("format");
                layer.resolution = $('.compare-selected').parent().data("resolution");

                compare(layer);
                $('#compare-modal').hide();
            }
        });
    }

    createLayer = function(layer) {
        var instrumentLayer = document.createElement('div');
        $(instrumentLayer).addClass("instrument-layer");
        $(instrumentLayer).data("id", layer.id);
        $(instrumentLayer).data("startDate", layer.startDate);
        $(instrumentLayer).data("format", layer.format);
        $(instrumentLayer).data("resolution", layer.resolution);

        var endDate = (layer.endDate != null) ? layer.endDate : 'today';
        $(instrumentLayer).html("<div>" +layer.title + "</div>" + '<div class="layer-available"><span>Available: </span>' + layer.startDate + ' - ' + endDate  + '</div>');

        var toggleLayerButton = document.createElement("button");

        $(toggleLayerButton).on('click', function () {
            $(this).toggleClass('selected')
            var newProvider = provider.getProvider(layer.id, layer.startDate, layer.format, "epsg4326", layer.resolution);
            viewer.scene.imageryLayers.addImageryProvider(newProvider);
        });

        $(toggleLayerButton).addClass("view");
        $(instrumentLayer).append(toggleLayerButton);

        var compareButton = document.createElement("button");
        $(compareButton).html("C");
        $(compareButton).click(function () {
            $('.compare-selected').removeClass('compare-selected');
            $(this).addClass("compare-selected");
            $('#compare-modal').show();
        });
        $(instrumentLayer).append(compareButton);

        if (layer.endDate < isoDate(clock.currentTime.toString()) || layer.startDate > isoDate(clock.currentTime.toString())) {
            $(toggleLayerButton).attr('disabled', 'disabled');
            $(compareButton).attr('disabled', 'disabled');
        }
        return instrumentLayer;
    }

    /**
     * Compare FirstView and Second View of Earth
     */
    compare = function (layer) {

        var newProvider = provider.getProvider(layer.id, layer.firstDate, layer.format, "epsg4326", layer.resolution);
        viewer.scene.imageryLayers.addImageryProvider(newProvider);

        newProvider = provider.getProvider(layer.id, layer.secondDate, layer.format, "epsg4326", layer.resolution);
        secondView = viewer.scene.imageryLayers.addImageryProvider(newProvider);

        this.className = "button-selected";
        var slider = $("#slider");
        toggle(slider, function() {
            secondView.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        }, function() {
            secondView.splitDirection =  Cesium.ImageryLayer.DEFAULT_SPLIT;
        });

        referenceLayerProvider = provider.getProvider("Reference_Labels", '2016-11-19', "image/png", "epsg4326", "250m");
        viewer.scene.imageryLayers.addImageryProvider(referenceLayerProvider);
    }

    var searchSatellite = function() {
        var entity = viewer.entities.getById($('#search-satellite-text').val().toLowerCase());
        gotoSatellite(entity);
        $('#search-satellite-text').val("");
    }

    var gotoSatellite = function(entity) {
        if (entity == undefined) {
            return false;
        }
        showSatelliteToolbar(entity);
        viewer.trackedEntity = entity;
        viewer.selectedEntity = entity;
        return true;
    }

    $('#search-satellite-button').click(searchSatellite);
    $('#search-satellite-text').on('keypress', function(e) {
        if (e.keyCode === 13) {
            searchSatellite();
        }
    });