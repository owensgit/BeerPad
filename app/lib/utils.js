var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var utils = (function() {
    var methods = {};
    
    methods.updateObjectWithObject = function(obj1, obj2) {
        for (key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
            }
        }
    };
    
    methods.parseDateStringFromEpoch = function(date_epoch) {
        var date = new Date(parseInt(date_epoch, 10));  
        var thisYear = new Date().getFullYear();
        var date_string = date.toDateString();
        if (date.getFullYear() === thisYear) date_string = date_string.substring(0, date_string.length - 5); // trim year off end if current year
        return date_string;
    };
    
    methods.perentageIsValid = function (percent) {
        function percentNotANumber(percent) {
            var regEx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
            var percent = percent.replace(/%$/, "");
            return percent.match(regEx) === null && percent != "";
        }
        function percentNotValid(percent) {
            return parseInt(percent.replace(/%$/, ""), 10) > 100;
        }        
        if (percentNotANumber(percent)) {
            var dialog = Ti.UI.createAlertDialog({
                title: L('add_error_percent_not_num_title'),
                message: L('add_error_percent_not_num_msg'),
                ok: L('add_error_percent_not_num_ok')
            }).show();
            return false;  
        }
        if (percentNotValid(percent)) {
            var dialog = Ti.UI.createAlertDialog({
                title: L('add_error_percent_too_high_title'),
                message: L('add_error_percent_too_high_msg'),
                ok: L('add_error_percent_too_high_ok'),
            }).show();
            return false;    
        }
        return true;
    };
    
    /**
     * Wait for the final event to finish inside an event listener to avoid multiple functions from running. Useful
     * when listening to keyboard events on user inputs, so ensure that the desired function doesn't rapidly fire many
     * times as the user types, and only fires once, x number milliseconds after the user has finished typing. This
     * is used on the predictive search.
     * 
     * Example use: ``utils.waitForFinalEvent(function () { alert("Hello!"); }, 300, "Say hello");``
     * 
     * @method waitForFinalEvent
     * @param callback {Function} function to be performed when final event has been fired
     * @param ms {Integer} number of millseconds to wait after the final event
     * @param uniqueId {Integer} a unique string that identifies the event
     * @return false
     */
    methods.waitForFinalEvent = (function () {
      var timers = {};
      return function (callback, ms, uniqueId) {
        if (!uniqueId) {
          uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
          clearTimeout (timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
      };
    })();
    
    methods.lookUpResultsView = function () {
        var view = Ti.UI.createView({
            height: Ti.UI.SIZE, width: Ti.UI.SIZE, top: "46dp", bottom: "5dp",
            backgroundColor: "#FFFFFF", borderColor: "#b0b0b0", borderRadius: "5dp"
        });  
        return view;    
    };
    
    methods.lookUpTableView = function (rows) {
        var tableView = Ti.UI.createTableView({ data: rows, rowHeight: 36, width: "260dp" });   
        var height = rows.length * tableView.getRowHeight();
        if (rows.length > 4) { height = (4 * tableView.getRowHeight()) - 14; }
        tableView.height = height;
        return tableView;    
    };
    
    return methods;
})();


module.exports = utils;