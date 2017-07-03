import React from 'react';
import ReactDOM from 'react-dom';
import '../css/main.css';
import SatellitePanelView from './satellite-panel-view.jsx';

class Views extends React.Component {

    render() {
        return (
            <SatellitePanelView />
        );
    }

};

ReactDOM.render(<Views/>, document.getElementById("main-container"));