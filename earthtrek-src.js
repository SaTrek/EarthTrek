var EarthTrekEntity = require('./src/js/earthtrek-entity');
var EarthTrekData = require('./src/js/earthtrek-data');
var EarthTrekHandler = require( './src/js/earthtrek-handler');
var EarthTrekCore = require('./src/js/earthtrek-core').default;
var earthTrekUtils = require('./src/js/utils/earthtrek-utils');
var {earthTrekInstance} = require('./dist/js/earthtrek-core');
var EarthTrekLayer = require('./src/js/earthtrek-layer');
var EarthTrekProvider = require('./src/js/earthtrek-propagation');
var EarthTrekSatellite = require('./src/js/earthtrek-satellite');
var EarthTrekPropagation = require('./src/js/earthtrek-propagation');
var EarthTrekToolbar = require('./src/js/utils/earthtrek-toolbar');
var EarthTrekRightToolbar = require('./src/js/utils/earthtrek-right-toolbar');

var EarthTrek = {
    Core: EarthTrekCore,
    Data: EarthTrekData,
    Entity: EarthTrekEntity,
    Handler: EarthTrekHandler,
    Layer: EarthTrekLayer,
    utils: earthTrekUtils,
    provider: EarthTrekProvider,
    satellite: EarthTrekSatellite,
    propagation: EarthTrekPropagation,
    Toolbar: EarthTrekToolbar,
    RightToolbar: EarthTrekRightToolbar,
    instance: earthTrekInstance
};
module.exports = EarthTrek;