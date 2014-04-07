var theBeers = Alloy.Collections.beers;
theBeers.fetch();

Alloy.Globals.navGroupWin = $.navGroupWin;

// Set of defaults to load if no current data is present

var default_beers = [
    { date: "1391377283743", name: "London Pride", brewery: "Fullers", rating: 4, percent: 3.4, establishment: "The Queens Head", location: "Hammersmith", notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste." },
    { date: "1392068483743", name: "Red Currant Stout", brewery: "Clarence & Fredericks", percent: 5.4, rating: 4, establishment: "Prats & Payne", location: "Streatham Hill", notes: "Dark, robust and full of flavour with currant flavours. Quite strong and heavy, so perhaps better to drink by the half.", beer_image: "sample_redcurrantstout.jpg" },
    { date: "1393537283743", name: "Hob Goblin", brewery: "Wychwood Brewery Company", percent: 4.3, rating: 4, establishment: "The White Lion", location: "Stretham Hill", notes: "Great, full falvoured ale with lots of character. Be careful with this one, it's got a pretty high percentage!", beer_image: "sample_hobgoblin.jpg" },
    { date: "1396815002000", name: "Doom Bar", brewery: "Sharps", rating: 4, percent: 4, establishment: "The Ship Inn", location: "Caerleon, Newport, Wales", notes: "Nice balance of hoppy, malty and bitter tastes. Available nearly everywhere near Cornwall. Always priced really well.", beer_image: "sample_doombar.jpg" }
];


// If no current data is present, load up the default data

if (_.isEmpty(theBeers.toJSON())) {
    _.each(default_beers, function (item) {
        var date = new Date(parseInt(item.date, 10));  
        var thisYear = new Date().getFullYear();
        var date_string = date.toDateString();
        if (date.getFullYear() === thisYear) date_string = date_string.substring(0, date_string.length - 5);
        item.date_string = date_string;
        item.beer_image = item.beer_image? item.beer_image : null;
        var beer = Alloy.createModel('beers', item);
        theBeers.add(beer);    
        beer.save();
    });
}


// Select a beer and view it's information

$.beersTable.addEventListener("click", function(event) {
    var selectedBeer = event.row;
      
    var args = {};
    
    _.each(selectedBeer, function(value, key) {
       args[key] = value; // store all info to pass to the view
    });
    
    args.model = theBeers.get(event.row.alloy_id);
    
    var view = Alloy.createController("BeerDetail", args).getView();
    
    if (OS_IOS) { 
       $.navGroupWin.openWindow(view);
    } 
    if (OS_ANDROID) { 
       view.open(); 
    }
});


function transformFunction (modal) {
        
    var result = modal.toJSON();
    
    /*function getImage() {
        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, result.alloy_id + '.jpg');  
        return f.read();  
    }
    var theImage = getImage();
    result.beer_image = theImage || "dafaultListImage.png";
   
    if (!result.beer_image) { 
        result.beer_image = "dafaultListImage.png";
    } */
    
    if (!result.beer_image) { 
        result.list_image = "dafaultListImage.png";
    } else {
        result.list_image = result.beer_image;
    }
    
    var secValue = Alloy.Globals.beerListSecondaryValue;

    if (secValue === "rating") {
        result.secondaryInfo = result.rating === null ? "No rating" : result.rating + " stars";    
    } else if (secValue === "percent") {
        result.secondaryInfo = "" + result.percent + "%";
    } else if (secValue === "date") {
        result.secondaryInfo = "" + result.date_string;
    } else {
        result.secondaryInfo = result[secValue];    
    }    
    return result;
}


$.filterDialog.cancel = 8;
$.filterDialog.addEventListener("click", function (e) {
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


/*
 *  iOS Only
 *  --------
 */
if (OS_IOS) { 

   // Left & Right buttons in title bar: Edit & New
   
   var addButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.ADD });
   var editButton = Ti.UI.createButton({ title: "Sort" });
   
   $.beerListWin.setRightNavButton(addButton);
   $.beerListWin.setLeftNavButton(editButton);
   
   
   // Add a new beer
    
   addButton.addEventListener("click", function () {
        var window = Alloy.createController('addBeer').getView();
        window.open({
            modal:true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
   });
   
   
   // Edit the table & delete a row
   editButton.addEventListener("click", function(event) {
       $.filterDialog.show();
   });
   $.beersTable.addEventListener("delete", function(event) {
      setTimeout(function () {
          var beersCollection = Alloy.Collections.beers;
          var beer = beersCollection.get(event.rowData.alloy_id);
          beer.destroy();
      }, 500);
   });
   
   // Open the main app window
   var welcome = Alloy.createController("welcome").getView();
   if (Ti.App.Properties.getString("welcomeDone") === "true") {
       $.navGroupWin.open();  
   } else {
       welcome.open();
   }
} 

/*
 *  Androind Only
 *  -------------
 */
if (OS_ANDROID) { 
    
   // Open the main app window
   
   $.index.open(); 
   
}





