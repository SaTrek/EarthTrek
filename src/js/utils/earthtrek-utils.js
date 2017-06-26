/**
 * @class earthTrekUtils
 * @module EarthTrek
 * @author SATrek
 * @author Alejandro Sanchez <alejandro.sanchez.trek@gmail.com>
 * @description EarthTrek - NASA Space Apps 2017 - 8 JUN 2017.
 */

import { earthTrekInstance } from '../earthtrek-core';
import queryString from 'query-string';

var earthTrekUtils = earthTrekUtils || {};

earthTrekUtils.isoDate = function (isoDateTime) {
    return isoDateTime.split("T")[0];
};

earthTrekUtils.getCurrentIsoDate = function () {
    return earthTrekUtils.isoDate(earthTrekInstance().clock.currentTime.toString());
};

earthTrekUtils.getQueryString = function () {
    return queryString.parse(location.search);
};
module.exports = earthTrekUtils;