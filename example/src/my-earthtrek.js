/**
 * @class EarthTrek Example
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */

import EarthTrek from 'earthtrek-core';
require('./css/right-toolbar.css');
class MyEarthTrek  {

    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        this.earthTrek = new EarthTrek.Core(options);
        if (!options.showReference) {
            options.showReference = true;
        }
        if (!options.showBorders) {
            options.showBorders = true;
        }
        this.showReference = options.showReference;
        this.showBorders = options.showBorders;
    }

    render() {
        this.listeners();
        this.earthTrek.pullSatellitesData((satelliteData, entity) => {
            if (entity == null && satelliteData.status == 'ACTIVE') {
                this.earthTrek.addEntity(satelliteData);
            }
        });
        this.drawReferenceLayers();

     //   this.addHandlers();

        this.parseQueryString();
    }

    /**
     * Draw reference layers
     */
    drawReferenceLayers() {
        if (this.showReference == true) {
            const layer = {
                id: "Reference_Labels",
                format: "image/png",
                resolution: '250m',
                top: true,
                maximumLevel: 9
            };

            EarthTrek.RightToolbar.addToogleLayer(layer, 'icon-labels', true);
        }

        if (this.showBorders == true) {
            const layer = {
                id: "Reference_Features",
                format: "image/png",
                resolution: '250m',
                top: true,
                maximumLevel: 9
            };
            EarthTrek.RightToolbar.addToogleLayer(layer, 'icon-borders', true);
        }
    }
    parseQueryString() {
        const parsed = EarthTrek.utils.getQueryString();
        if (parsed.geocoder != undefined) {
            this.earthTrek.getViewer().geocoder.viewModel.searchText = parsed.geocoder;
            this.earthTrek.getViewer().geocoder.viewModel.search();
        }
    }

    listeners() {
        this.earthTrek.getEventEmitter().on('date-updated', (params) => {

        });

        this.earthTrek.getEventEmitter().on('update-orbital-data', (params) => {
        });

        this.earthTrek.getEventEmitter().on('entity-added', (params) => {
        });

        this.earthTrek.getEventEmitter().on('entities-added', () => {
        });

        this.earthTrek.getEventEmitter().on('entity-updated', (params) => {
        });

        this.earthTrek.getEventEmitter().on('entities-updated', () => {

        });
    }

    /**
     * Render Views
     */
    renderViews() {
    }

}

module.exports = MyEarthTrek;