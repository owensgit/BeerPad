/*
 * @fileOverview the main controller for the 'info pills' widget
 */
var args = arguments[0] || {};

$.currentPillData = [];
$.pills = [];

$.updatePills = function (pillData) {

    for (var i = 0; i < pillData.length; i++) {
        if ($.pills[i]) {
            $.pills[i].setText(pillData[i].text);
        } else {
            $.createNewPill(pillData[i]);
        }
    }
    
    $.trimPills(pillData);
}

$.trimPills = function(pillData) {
    if ($.pills.length > pillData.length) {
        var excess = $.pills.splice(pillData.length);
        console.log('excess pills', excess);
        excess.forEach(function (item) {
            $.inner.remove(item.getView());
        });
    }
}

$.createNewPill = function (item) {
    var pill = Widget.createController(
        'pill', 
        {
            text: item.text
        }
    );
    $.inner.add(pill.getView());
    $.pills.push(pill);
}

/**
 * Create each individual pill view from an array of data
 * @param pillData {Array} contains an obj for each pill, needs at least text
 */
$.createPills = function(pillData) {
    $.currentPillData = pillData;
    setTimeout(function () {
        $.updatePills(pillData);
    }, 0);
}