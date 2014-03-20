var theBeers = Alloy.Collections.beers;
theBeers.fetch();

Alloy.Globals.navGroupWin = $.navGroupWin;

// Set of defaults to load if no current data is present

var default_beers = [
    { date: "1395265283743", name: "Ultra Weak", brewery: "Fullers", rating: 0, percent: 0.1, establishment: "The Queens Head", location: "Hammersmith", notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste." },
    { date: "1393537283743", name: "Super Strength", brewery: "Fullers", rating: 1, percent: 10.5, establishment: "The Queens Head", location: "Hammersmith", notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste." },
    { date: "1391377283743", name: "London Pride", brewery: "Fullers", rating: 2, percent: 3.4, establishment: "The Queens Head", location: "Hammersmith", notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste." },
    { date: "1392068483743", name: "Oat Milk Stout", brewery: "Clarence & Fredericks", percent: 6.2, rating: 3, establishment: "Prats & Payne", location: "Streatham Hill", notes: "Dark, robust and full of flavour. Quite strong too. Could only drink one or two pints as it's quite heavy, but it's very tasty." },
    { date: "1393537283743", name: "Hob Goblin", brewery: "Wychwood Brewery Company", percent: 4.3, rating: 4, establishment: "", location: "", notes: "" },
    { date: "1395265283743", name: "Greene King IPA", brewery: "Greene King", rating: 5, percent: 2.2, establishment: "", location: "", notes: "" }
];


// If no current data is present, load up the default data

if (_.isEmpty(theBeers.toJSON())) {
    _.each(default_beers, function (item) {
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



$.filterDialog.addEventListener("click", function (e) {
    if (e.index === 0) {
        theBeers.setSortField("date", "DESC");
        theBeers.sort();   
    }
    if (e.index === 1) {
        theBeers.setSortField("date", "ASC");
        theBeers.sort();
    }
    if (e.index === 2) {
        theBeers.setSortField("date", "DESC");
        theBeers.sort();
    }
    if (e.index === 3) {
        theBeers.setSortField("date", "ASC");
        theBeers.sort();
    }
    if (e.index === 4) {
        theBeers.setSortField("percent", "DESC");
        theBeers.sort();
    }
    if (e.index === 5) {
        theBeers.setSortField("percent", "ASC");
        theBeers.sort();
    }
    if (e.index === 6) {
        theBeers.setSortField("percent", "DESC");
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
   /*editButton.addEventListener("click", function(event) {
        if (!$.beersTable.editing) {
            $.beersTable.editing = true;
            this.title = "Cancel";
        } else {
            $.beersTable.editing = false;
            this.title = "Edit";
        }
   });*/
   $.beersTable.addEventListener("delete", function(event) {
      setTimeout(function () {
          var beersCollection = Alloy.Collections.beers;
          var beer = beersCollection.get(event.rowData.alloy_id);
          beer.destroy();
      }, 500);
   });
   
   
   // Open the main app window
   
   $.navGroupWin.open();
} 

/*
 *  Androind Only
 *  -------------
 */
if (OS_ANDROID) { 
    
   // Open the main app window
   
   $.index.open(); 
   
}





