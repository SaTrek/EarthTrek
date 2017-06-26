'use strict';

var _earthtrekCore = require('../earthtrek-core');

var _queryString = require('query-string');

var _queryString2 = _interopRequireDefault(_queryString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @class earthTrekUtils
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 8 JUN 2017.
 */

var earthTrekUtils = earthTrekUtils || {};

earthTrekUtils.isoDate = function (isoDateTime) {
    return isoDateTime.split("T")[0];
};

earthTrekUtils.getCurrentIsoDate = function () {
    return earthTrekUtils.isoDate((0, _earthtrekCore.earthTrekInstance)().clock.currentTime.toString());
};

earthTrekUtils.getQueryString = function () {
    return _queryString2.default.parse(location.search);
};
module.exports = earthTrekUtils;