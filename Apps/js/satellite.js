
    /**
     * Show Satellite Toolbar UI
     * @param dataSource
     */
    showSatelliteToolbar = function (entity, satellitesData) {
        var satelliteToolbar = document.getElementById('satellite-toolbar');
        satelliteToolbar.style.display = "block";

        var instruments;
        //ESTO YA NO ES NECESARIO, LAS PROPIEDADES SE LAS QUEDA EL DATASOURCE...
        $.each( satellitesData.satellites, function( key, satellite  ) {
            if (satellite.id == entity.id) {
                instruments = satellite.instruments;

                if (instruments.length > 0) {
                    var instrumentText = document.createElement('div')
                    instrumentText.innerHTML = "<span>INSTRUMENTS</span>";
                    document.getElementById("satellite-instruments").appendChild(instrumentText);
                }

                for (var i = 0; i <= instruments.length - 1; i++) {
                    var instrumentName = instruments[i];
                    var instrument = document.createElement('div');
                    instrument.id = "satellite-instrument-" + satellite.id + "-" + instrumentName.name;
                    instrument.className = "satellite-instrument";
                    instrument.innerHTML = "<div>" + instrumentName.name + "</div>";
                    $(instrument).data('instrument', instrumentName.name);

                    var compareButton = document.createElement("button");
                    compareButton.innerHTML = "Compare";
                    compareButton.addEventListener('click', compare, false);
                    instrument.appendChild(compareButton);

                    var layerButton = document.createElement("button");
                    layerButton.innerHTML = "Layers";
                    layerButton.addEventListener('click', showLayers, false);
                    instrument.appendChild(layerButton);

                    document.getElementById("satellite-instruments").appendChild(instrument);
                }
            }
        });

    }

    showLayers = function (caller) {
        $("#satellite-instrument-layers").empty();
        caller.srcElement.parentElement.id;
        $.each(viewer.selectedEntity.properties.instruments.getValue(), function(key, instrument) {
            if (instrument.name == $(caller.srcElement.parentElement).data('instrument')) {
                $.each(instrument.layers, function(key, layer ) {
                    var instrumentLayer = document.createElement('div');
                    $(instrumentLayer).html(layer.title);

                    var time = "TIME=" + isoDate('2010-11-18');

                    var toggleLayerButton = document.createElement("button");
                    $(toggleLayerButton).on('click', function () {


                        console.log(viewer.scene.imageryLayers.length)
                        for (var i = 0; i <= viewer.scene.imageryLayers.length - 1; i++) {
                          //  console.log(viewer.scene.imageryLayers.get(i).imageryProvider.)
                        }
                        var provider = new Cesium.WebMapTileServiceImageryProvider({
                            url: "//map1.vis.earthdata.nasa.gov/wmts-geo/wmts.cgi?" + time,
                            layer: layer.name,
                            style: "",
                            format: "image/png",
                            tileMatrixSetID: "EPSG4326_2km",
                            maximumLevel: 8,
                            tileWidth: 256,
                            tileHeight: 256,
                            tilingScheme: gibs.GeographicTilingScheme()
                        });

                        viewer.scene.imageryLayers.addImageryProvider(provider);
                    });

                    $(toggleLayerButton).text("Ver");

                    $(instrumentLayer).append(toggleLayerButton);

                    $("#satellite-instrument-layers").append(instrumentLayer);
                });
            }
/*
            var instrument = document.createElement('div')
            instrument.className = "satellite-instrument";
            instrument.innerHTML = "<div>" + instrumentName.name + "</div>";*/
        });
        //$("satellite-instrument-layers").show();
    }


    /**
     * Compare FirstView and Second View of Earth
     */
    compare = function () {
        var compareSelected = document.getElementsByClassName("button-selected");
        for(var i = 0; i < compareSelected.length; i++) {
            compareSelected[i].classList.remove("button-selected");
            if (compareSelected[i] == this) {

            }
        }
        this.className = "button-selected";
        var slider = document.getElementById("slider");
        toogle(slider, function() {
            secondView.splitDirection = Cesium.ImagerySplitDirection.RIGHT;
        }, function() {
            secondView.splitDirection =  Cesium.ImageryLayer.DEFAULT_SPLIT;
        });
    }