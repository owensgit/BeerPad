var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var utils = (function() {
    var methods = {};
    
    methods.constructTweet = function (args) {
        var string = "Tried this beer called " + args.name + ",";
        if (args.brewery) {
            string = " by " + args.brewery;
        }
        if (args.establishment) {
            string = " at " + args.establishment; 
        }
    };
    
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
    
    return methods;
})();


module.exports = utils;