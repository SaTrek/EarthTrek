var EarthTrekEntity = require('./dist/js/earthtrek-entity');
var EarthTrekData = require('./dist/js/earthtrek-data');
var EarthTrekHandler = require( './dist/js/earthtrek-handler');
var EarthTrekCore = require('./dist/js/earthtrek-core').default;
var {earthTrekInstance} = require('./dist/js/earthtrek-core');
var earthTrekUtils = require('./dist/js/utils/earthtrek-utils');
var EarthTrekLayer = require('./dist/js/earthtrek-layer');
var EarthTrekProvider = require('./dist/js/earthtrek-propagation');
var EarthTrekSatellite = require('./dist/js/earthtrek-satellite');
var EarthTrekPropagation = require('./dist/js/earthtrek-propagation');
var EarthTrekToolbar = require('./dist/js/utils/earthtrek-toolbar');
var EarthTrekRightToolbar = require('./dist/js/utils/earthtrek-right-toolbar');

var EarthTrek = {
    Core: EarthTrekCore,
    Data: EarthTrekData,
    Entity: EarthTrekEntity,
    Handler: EarthTrekHandler,
    utils: earthTrekUtils,
    provider: EarthTrekProvider,
    satellite: EarthTrekSatellite,
    propagation: EarthTrekPropagation,
    Toolbar: EarthTrekToolbar,
    RightToolbar: EarthTrekRightToolbar,
    instance: earthTrekInstance
};
module.exports = EarthTrek;