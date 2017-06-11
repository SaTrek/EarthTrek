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

module.exports = earthTrekUtils;