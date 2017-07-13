import React from 'react';
import ReactDOM from 'react-dom';
import '../../../example-src/src/css/main.css';
import SatellitePanelView from './satellite-panel-view.jsx';

class EarthTrekReact extends React.Component {

    render() {
        return (
            <SatellitePanelView />
        );
    }

};

ReactDOM.render(<EarthTrekReact/>, document.getElementById("main-container"));