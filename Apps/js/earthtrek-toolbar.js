/**
 * Created by Alex on 07/05/2017.
 */

var earthTrekToolbar = earthTrekToolbar || {};

earthTrekToolbar.create = function(id, callback) {
    var toolbar = document.createElement('div');
    $(toolbar).attr('id', id);
    $(toolbar).addClass('earthtrek-toolbar');
    callback(toolbar);
    return toolbar;
}
