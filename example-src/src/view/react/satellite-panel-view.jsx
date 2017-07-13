/**
 * @class SatellitePanelView
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - 2 JUL 2017.
 */
import React from 'react'
import '../../css/panel.css';

class SatellitePanelView extends React.Component {

    constructor(props) {
        super(props);
        this.viewer = props.viewer;
        this.mainContainerId = this.viewer.container.id;
        if (!props.container) {
            throw new Error('Invalid  Container');
        }
        this.state = {
            opened: false,
        };
        this.satelliteName = 'Test';
        /*if (options.satelliteInfoContainer) {
            this.satelliteInfoContainer = '#' + options.satelliteInfoContainer;
        } else {
            this.satelliteInfoContainer = '#satellite-info';
        }
        this.satellitePanel = $('#' + options.container);
        this.instrumentsContainer = $("#satellite-instruments");
        this.layerView = new SatelliteLayerView(viewer);*/
    }

    show(entity) {

    }

    hide() {

    }

    render() {
        return (
            <div id="satellite-panel" className="earthtrek-panel">
                <div className="row satellite-panel-top">
                    <strong id="satellite-name">{this.satelliteName}</strong>
                </div>
                <div id="satellite-description" className="satellite-description">
                </div>
                <div className="row">
                    <div id="satellite-info">
                    </div>
                    <div id="satellite-instruments" className="col-sm-6 fixed-buttons">
                    </div>
                </div>
                <div className="row">
                    <div id="satellite-instrument-layers" className="col-sm-12">
                    </div>
                </div>
            </div>
        );
    }
}
export default SatellitePanelView;
