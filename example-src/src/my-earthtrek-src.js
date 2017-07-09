/**
 * @class EarthTrek Example
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */

import EarthTrek from '../../earthtrek-src';
require('./css/right-toolbar.css');

export default class MyEarthTrek  {

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

    /**
     * Render
     */
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
                maximumLevel: 9,
                removable: false
            };

            EarthTrek.RightToolbar.addToogleLayer(layer, 'icon-labels', true);
        }

        if (this.showBorders == true) {
            const layer = {
                id: "Reference_Features",
                format: "image/png",
                resolution: '250m',
                top: true,
                maximumLevel: 9,
                removable: false
            };
            EarthTrek.RightToolbar.addToogleLayer(layer, 'icon-borders', true);
        }
    }

    /**
     * Parse Query String example: Geocoder
     */
    parseQueryString() {
        const parsed = EarthTrek.utils.getQueryString();
        if (parsed.geocoder != undefined) {
            this.earthTrek.getViewer().geocoder.viewModel.searchText = parsed.geocoder;
            this.earthTrek.getViewer().geocoder.viewModel.search();
        }
    }

    /**
     * Listeners examples
     */
    listeners() {
        this.earthTrek.on('entity-added', (params) => {

        });
        this.earthTrek.on('date-updated', (params) => {

        });

        this.earthTrek.on('update-orbital-data', (params) => {
        });

        this.earthTrek.on('entity-added', (params) => {
        });

        this.earthTrek.on('entities-added', () => {
        });

        this.earthTrek.on('entity-updated', (params) => {
        });

        this.earthTrek.on('entities-updated', () => {

        });

        this.earthTrek.on('entities-updated', () => {

        });

        this.earthTrek.on('layer-removed', (params) => {

        });

        this.earthTrek.on('layer-hidden', (params) => {

        });
    }

    /**
     * Render Views
     */
    renderViews() {
    }

}