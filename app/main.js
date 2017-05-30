/**
 * @class Main
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 23 APR 2017.
 */
require('cesium/Source/Widgets/widgets.css');
var BuildModuleUrl = require('cesium/Source/Core/buildModuleUrl');
BuildModuleUrl.setBaseUrl('./');

var Viewer = require('cesium/Source/Widgets/Viewer/Viewer');

var viewer = new Viewer('main-container');