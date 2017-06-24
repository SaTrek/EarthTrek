/**
 * @class EarthTrek Example
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 23 APR 2017.
 */

/**EXTERNAL */
/***/
import EarthTrekEntity from '../src/js/earthtrek-entity';
import EarthTrekHandler from '../src/js/earthtrek-handler';
import EarthTrekCore from '../src/js/earthtrek-core';
import earthTrekUtils from '../src/js/utils/earthtrek-utils';

class MyEarthTrek  {

    /**
     * Constructor
     * @param options
     */
    constructor(options) {
        this.earthTrek = new EarthTrekCore(options);
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

            EarthTrekRightToolbar.addToogleLayer(layer, 'icon-labels', true);
        }

        if (this.showBorders == true) {
            const layer = {
                id: "Reference_Features",
                format: "image/png",
                resolution: '250m',
                top: true,
                maximumLevel: 9
            };
            EarthTrekRightToolbar.addToogleLayer(layer, 'icon-borders', true);
        }
    }

    beforeInit() {
        this.listeners();
        this.pullSatellitesData((satelliteData, entity) => {
            if (entity == null && satelliteData.status == 'ACTIVE') {
                this.addEntity(satelliteData);
            }
        });
    }

    afterInit() {
        this.drawReferenceLayers();

        this.addHandlers();

        this.parseQueryString();
    }

    parseQueryString() {
        const parsed = earthTrekUtils.getQueryString();
        if (parsed.geocoder != undefined) {
            this.getViewer().geocoder.viewModel.searchText = parsed.geocoder;
            this.getViewer().geocoder.viewModel.search();
        }
    }

    listeners() {
        this.getEventEmitter().on('date-updated', (params) => {

        });

        this.getEventEmitter().on('update-orbital-data', (params) => {
        });

        this.getEventEmitter().on('entity-added', (params) => {
        });

        this.getEventEmitter().on('entities-added', () => {
        });

        this.getEventEmitter().on('entity-updated', (params) => {
        });

        this.getEventEmitter().on('entities-updated', () => {

        });
    }

    /**
     * Render Views
     */
    renderViews() {
    }

    /**
     * Add Handlers
     */
    addHandlers () {
        const handler = new EarthTrekHandler(this.viewer);
        handler.onLeftClick(
            (pickedEntity) => {
                EarthTrekEntity.setDefaultPath(pickedEntity, {width: 1, orbitalMaterial: this.orbitalMaterial});
            },
            (entity) => {
                EarthTrekEntity.setGlowPath(entity, this.viewer.clock.currentTime);
                //TODO - Show move to an event
               // satellitePanel.show(entity);
                this.eventEmitter.emit('satellite-click', entity);
                //  this.evt.raiseEvent(entity);
            },
            () => {
                //TODO - Hide move to an event
                //satellitePanel.hide();
                this.viewer.trackedEntity = undefined;
            }
        );

        handler.onMouseMove(
            (entity) => {
                EarthTrekEntity.setGlowPath(entity, this.viewer.clock.currentTime);
            },
            (entity) => {
                EarthTrekEntity.setDefaultPath(entity, {width: 1, orbitalMaterial: this.orbitalMaterial});
            }
        );
    };

}

module.exports = EarthTrek;