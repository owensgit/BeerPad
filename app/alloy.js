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
var GA = require('analytics.google');


var theBeers = Alloy.createCollection("beers");
theBeers.fetch();


Alloy.Globals.beerListSecondaryValue = 'brewery';


// Set up Google Analytics...

GA.trackUncaughtExceptions = true;
Alloy.Globals.GoogleAnalytics = GA.getTracker(Alloy.CFG.analytics.google_analytics_id);


// Track opening of the App

Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.app_opened, value: 1 });




Alloy.Globals.mapLabelText = function($, args, shouldSetImage) { 

    $.name.text = args.name.toUpperCase();
    
    var breweryAndPercentText = args.percent ? args.brewery + " | " + args.percent : args.brewery;
    
    if (!args.percent  &&  args.brewery) breweryAndPercentText = args.brewery;
    if ( args.percent  &&  args.brewery) breweryAndPercentText = args.brewery + " | " + args.percent + "%";
    if ( args.percent  && !args.brewery) breweryAndPercentText = args.percent + "%";
    
    $.brewery.text = breweryAndPercentText;
    $.pub.text = args.establishment || L("detail_no_pub");
    $.location.text = args.location || L("detail_no_location");
    $.notes.text = args.notes;
    
    var theImage = Alloy.Globals.getImage(args);

    if (theImage && shouldSetImage) {
        $.image.setImage(theImage);   
    }

    if (!args.establishment) {
        $.buildingIcon.setImage('buildingGrey.png');
        $.pub.setColor('#b9b9b9');
    } else {
        $.buildingIcon.setImage('building.png'); 
        $.pub.setColor('#000000');
    }
    if (!args.location) {
        $.locationIcon.setImage('locationGrey.png');
        $.location.setColor('#b9b9b9');
    } else {
        $.locationIcon.setImage('location.png'); 
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
    }
};


Alloy.Globals.saveImage = function(alloy_id, theImage) {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');
    f.write(theImage);  
};


Alloy.Globals.openBeerDetails = function (event, collection, target) {
    var selectedBeer = event.row;
      
    var args = {};
    
    _.each(selectedBeer, function(value, key) {
       args[key] = value; // store all info to pass to the view
    });
    
    args.model = collection.get(event.row.alloy_id);
    
    var view = Alloy.createController("BeerDetail", args).getView();
    
    Alloy.Globals.mainTabGroup.getActiveTab().open(view, { animated: true });      
};


Alloy.Globals.beerListTransform = function(modal) {
        
    var result = modal.toJSON();
    
    if (result.is_sample) {
        result.tableMiddleLabel = "SAMPLE";
    }
   
    if (!result.beer_image) { 
        result.list_image = "dafaultListImage.png";
    } else {
        if (result.beer_image.indexOf('sample_') === 0) {
            result.list_image = result.beer_image;
        } else {
            result.list_image = Alloy.Globals.getImage(result.alloy_id);   
        }
    }   
    
    var secValue = Alloy.Globals.beerListSecondaryValue;

    if (secValue === "rating") {
        result.secondaryInfo = result.rating === null ? "No rating" : result.rating + " stars";    
    } else if (secValue === "percent") {
        result.secondaryInfo = result.percent ? "" + result.percent + "% abv" : "- - % abv";
    } else if (secValue === "date") {
        result.secondaryInfo = "" + result.date_string;
    } else {
        result.secondaryInfo = result[secValue];    
    }    
    
    return result;
};


Alloy.Globals.returnSortingDialog = function (theBeers) {
    var opts = [
        L("sort_newest"), L("sort_oldest"), L("sort_rated_high"), L("sort_rated_low"), 
        L("sort_percent_desc"), L("sort_percent_asc"), L("sort_name_asc"), L("sort_name_desc"), L("sort_cancel") 
    ];
    
    var filterDialog = Ti.UI.createOptionDialog({
        title: L("sort_title"),
        options: opts
    });
    
    filterDialog.cancel = 8;
    
    filterDialog.addEventListener("click", function (e) {
        
        Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.list_sorting_used, value: 1 });
        
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
            theBeers.setSortField("name", "DESC");
            theBeers.sort();
        }
    });    
    
    return filterDialog;
};



Alloy.Globals.addToFavourites = function (alloy_id) {
    console.log("Event fired add to favourites");
    Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.add_to_favourites, value: 1 });
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
        Alloy.Globals.GoogleAnalytics.trackEvent({ category: "AppEvent", action: Alloy.CFG.analytics.beer_added_action, value: 1 });
        beer.set({favourite: 1});    
    }      
    beer.save();
    //console.log("Now set to: ", beer.toJSON().favourite);   
});


// Set of defaults to load if no current data is present

var sample_beers = require("samples");



// If no current data is present, load up the default data

if (_.isEmpty(theBeers.toJSON())) {
    _.each(sample_beers, function (item) {
        item.date_string = utils.parseDateStringFromEpoch(item.date);
        item.is_sample = true;
        var beer = Alloy.createModel('beers', item);
        theBeers.add(beer);    
        beer.save();
    });
}


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
