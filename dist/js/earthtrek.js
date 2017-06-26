'use strict';

var EarthTrekEntity = require('./earthtrek-entity');
var EarthTrekData = require('./earthtrek-data');
var EarthTrekHandler = require('./earthtrek-handler');
var EarthTrekCore = require('./earthtrek-core');
var earthTrekUtils = require('./utils/earthtrek-utils');
var EarthTrekLayer = require('./earthtrek-layer');
var EarthTrekProvider = require('./earthtrek-propagation');
var EarthTrekSatellite = require('./earthtrek-satellite');
var EarthTrekPropagation = require('./earthtrek-propagation');
var EarthTrekToolbar = require('./utils/earthtrek-toolbar');
var EarthTrekRightToolbar = require('./utils/earthtrek-right-toolbar');

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
    RightToolbar: EarthTrekRightToolbar
};
module.exports = EarthTrek;