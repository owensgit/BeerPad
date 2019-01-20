var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");

var utils = (function() {
    var methods = {};
    
    /**
     * Update properties in object 1 with matching properties from object 2
     */
    methods.updateObjectWithObject = function(obj1, obj2) {
        for (key in obj2) {
            if (obj2.hasOwnProperty(key)) {
                obj1[key] = obj2[key];
            }
        }
    };
    
    methods.buildBreweryAndPercentString = function (brewery, percent) {
        var breweryAndPercentText = percent ? brewery + " | " + percent : brewery;
    
        if (!percent  &&  brewery) breweryAndPercentText = brewery;
        if ( percent  &&  brewery) breweryAndPercentText = brewery + " | " + percent + "%";
        if ( percent  && !brewery) breweryAndPercentText = percent + "%";
        
        return breweryAndPercentText;
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
    
    methods.ibuIsValid = function (ibu) {
      if (ibu === "") {
        return true;
      }
      var numRegEx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
      if (!numRegEx.test(ibu)) {
        var dialog = Ti.UI.createAlertDialog({
            title: L('add_error_ibu_not_number_title'),
            message: L('add_error_ibu_not_number_msg'),
            ok: L('add_error_ibu_not_number_ok'),
        }).show();
        return false;
      }
      ibu = parseInt(ibu, 10);
      if (ibu < 0 || ibu > 120) {
        var dialog = Ti.UI.createAlertDialog({
            title: L('add_error_ibu_out_of_range_title'),
            message: L('add_error_ibu_out_of_range_msg'),
            ok: L('add_error_ibu_out_of_range_ok'),
        }).show();
        return false;
      }
      return true;
    };

    /**
     *  View a beer image from the Beer Detail screen
     *  
     *  @param image {Object} image object taken from an ImageView, by using theImageView.image
     */
    methods.viewBeerImage = function (image, mainTabGroup) {
        var beerImage = Alloy.createController("BeerImage");
        beerImage.image.image = image;
        beerImageView = beerImage.getView();
        console.log('mainTabGroup', mainTabGroup);
        mainTabGroup.getActiveTab().open(beerImageView);
    };
    
    
    methods.mapLabelsToNewArgs = function ($, args, rating, coords, dateUTC) {
    	
        var newArgs = {
            name: $.name.value,
            brewery: $.brewery.value,
            style: $.style.value,
            rating: rating, // set by applyRating() func below
            percent: $.percent.value,
            establishment: $.establishment.value,
            location: $.location.value,
            notes: $.notes.value,
            ibu: $.ibu.value,
            api_id: args.api_id || null
        };
        
        newArgs.date = dateUTC;
    
        if (coords) {
            newArgs.latitude = coords.latitude;
            newArgs.longitude = coords.longitude;
        }
        
        if ($.location.value === "") {
            newArgs.latitude = null;
            newArgs.longitude = null;
            newArgs.location = null;
        }
    
        return newArgs;        
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
    
    return methods;
})();


module.exports = utils;