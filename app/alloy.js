// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// args. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var utils = require("utils");
var sample_beers = require("samples");


var theBeers = Alloy.createCollection("beers");
theBeers.fetch();

var platformHeight = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.is_iPhone4 = platformHeight === 480;
Alloy.Globals.is_iPhone5 = platformHeight === 568;
Alloy.Globals.is_iPhone6 = platformHeight === 667;
Alloy.Globals.is_iPhone6andAbove = platformHeight >= 667;
Alloy.Globals.is_iPhone6plus = platformHeight === 736;

Alloy.Globals.beerListSecondaryValue = 'brewery';


Alloy.Globals.fa = require('fa'); 


// Set up Google Analytics...
//var GA = require('analytics.google');
//GA.trackUncaughtExceptions = true;
//Alloy.Globals.GA = GA.getTracker("UA-50958937-2");



// If no current data is present, load up the sample beers

if (_.isEmpty(theBeers.toJSON())) {
    _.each(sample_beers, function (item) {
        item.is_sample = true;
        var beer = Alloy.createModel('beers', item);
        theBeers.add(beer);    
        beer.save();
    });
}



Alloy.Globals.mapLabelText = function($, args, shouldSetImage) { 

    $.name.text = args.name.toUpperCase();
    
    $.brewery.text = utils.buildBreweryAndPercentString(args.brewery, args.percent);
    
    $.pub.text = args.establishment || L("detail_no_pub");
    $.location.text = args.location || L("detail_no_location");
    $.notes.text = args.notes;
    $.date.text = utils.parseDateStringFromEpoch(args.date);
     
    var theImage = Alloy.Globals.getImage(args);

    if (theImage && shouldSetImage) {
        $.image.setImage(theImage);   
    }

    if (!args.establishment) {
        $.buildingIcon.setColor('#c7c7c7');
        $.pub.setColor('#c7c7c7');
    } else {
        $.buildingIcon.setColor(Alloy.CFG.colour.main); 
        $.pub.setColor('#000000');
    }
    if (!args.location) {
        $.locationIcon.setColor('#c7c7c7');
        $.location.setColor('#c7c7c7');
    } else {
        $.locationIcon.setColor(Alloy.CFG.colour.main);	
        $.location.setColor('#000000');   
    }
};


Alloy.Globals.getImage = function(args) {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, args.alloy_id + '.jpg');  
    var fileSystemImage = f.read();  
    if (fileSystemImage) {
        return fileSystemImage;
    }
    if (args.beer_image) {
        if (args.beer_image.indexOf("sample_") === 0) {
            return args.beer_image;
        }
        return args.beer_image;
    }
};


Alloy.Globals.saveImage = function(alloy_id, theImage) {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');
    f.write(theImage);  
};


Alloy.Globals.openBeerDetails = function (event, controller) {
    var selectedBeer = event.row;
    
    var controller = controller ? controller : "BeerDetail";
      
    var args = {};
    
    _.each(selectedBeer, function(value, key) {
       args[key] = value;
    }); 
   
    var view = Alloy.createController(controller, args).getView();
    
    Alloy.Globals.mainTabGroup.getActiveTab().open(view, { animated: true });      
};


Alloy.Globals.beerListTransform = function(modal) {
        
    var result = modal.toJSON();
    
    if (result.is_sample) {
        result.tableMiddleLabel = "SAMPLE";
    }  
    
    var secValue = Alloy.Globals.beerListSecondaryValue;

    if (secValue === "rating") {
        result.secondaryInfo = result.rating === null ? "No rating" : result.rating + " stars";    
    } else if (secValue === "percent") {
        result.secondaryInfo = result.percent ? "" + result.percent + "% abv" : "- - % abv";
    } else if (secValue === "date") {
        result.secondaryInfo = "" + utils.parseDateStringFromEpoch(result.date, true);
    } else {
        result.secondaryInfo = result[secValue];    
    }    
    
    return result;
};


Alloy.Globals.returnSortingDialog = function (theBeers) {
    var opts = [
        L("sort_newest"), L("sort_oldest"), L("sort_rated_high"), L("sort_rated_low"), 
        L("sort_percent_desc"), L("sort_percent_asc"), 
        L("sort_name_asc"),
        L("sort_brewery_asc"),
        L("sort_cancel") 
    ];
    
    var filterDialog = Ti.UI.createOptionDialog({
        options: opts
    });
    
    filterDialog.cancel = 8;
    
    filterDialog.addEventListener("click", function (e) {
        
        /*if (e.index != 8) {
            Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.list_sorting_used, value: 1 });
        }*/
        
        if (e.index === 0) {
            Alloy.Globals.beerListSecondaryValue = "date";
            theBeers.setSortField("date", "DESC");
            theBeers.sort();  
        }
        if (e.index === 1) {
            Alloy.Globals.beerListSecondaryValue = "date";
            theBeers.setSortField("date", "ASC");
            theBeers.sort();
        }
        if (e.index === 2) {
            Alloy.Globals.beerListSecondaryValue = "rating";
            theBeers.setSortField("rating", "DESC");
            theBeers.sort();
        }
        if (e.index === 3) {
            Alloy.Globals.beerListSecondaryValue = "rating";
            theBeers.setSortField("rating", "ASC");
            theBeers.sort();
        }
        if (e.index === 4) {
            Alloy.Globals.beerListSecondaryValue = "percent";
            theBeers.setSortField("percent", "DESC");
            theBeers.sort();
        }
        if (e.index === 5) {
            Alloy.Globals.beerListSecondaryValue = "percent";
            theBeers.setSortField("percent", "ASC");
            theBeers.sort();
        }
        if (e.index === 6) {
            Alloy.Globals.beerListSecondaryValue = "brewery";
            theBeers.setSortField("name", "ASC");
            theBeers.sort();
        }
        if (e.index === 7) {
            Alloy.Globals.beerListSecondaryValue = "brewery";
            theBeers.setSortField("brewery", "ASC");
            theBeers.sort();
        }
    });    
    
    return filterDialog;
};



Alloy.Globals.addToFavourites = function (alloy_id) {
    console.log("Event fired add to favourites");
    //Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.add_to_favourites, value: 1 });
    var beerCollection = Alloy.Collections.beers;
    beerCollection.fetch();
    var theBeer = beerCollection.where({"alloy_id": alloy_id})[0];
    theBeer.set({favourite: 1});
    theBeer.save();
};



Ti.App.addEventListener("app:addToFavorites", function (e) {
    console.log("e.args.favourite", e.args.favourite);
    console.log("e.args.alloy_id", e.args.alloy_id);
    var theBeers = Alloy.Collections.beers;
    
    var beer = theBeers.where({"alloy_id": e.args.alloy_id})[0];
    
    if (e.args.favourite === 1) {
        beer.set({favourite: 0});    
    } else {
        //Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.add_to_favourites, value: 1 });
        beer.set({favourite: 1});    
    }      
    beer.save();
    //console.log("Now set to: ", beer.toJSON().favourite);   
});



/**
* Wait for the final event to finish inside an event listener to avoid multiple functions from running. Useful
* when listening to keyboard events on user inputs, so ensure that the desired function doesn't rapidly fire many
* times as the user types, and only fires once, x number milliseconds after the user has finished typing. This
* exact use case if used on the predictive search.
* 
* Example use: ``Alloy.Globals.waitForFinalEvent(function () { alert("Hello!"); }, 300, "Say hello");``
* 
* @method waitForFinalEvent
* @param {Function} callback function to be performed when final event has been fired
* @param {Integer} ms number of millseconds to wait after the final event
* @param {Integer} uniqueId a unique string that identifies the event
* @return false
*/
Alloy.Globals.waitForFinalEvent = (function () {
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
