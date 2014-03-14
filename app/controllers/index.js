var theBeers = Alloy.Collections.beers;
theBeers.fetch();
    
// Set of defaults to load if no current data is present

var default_beers = [
    { name: "London Pride", brewery: "Fullers", rating: 80, establishment: "The Queens Head", location: "Hammersmith", notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste." },
    { name: "Oat Milk Stout", brewery: "Clarence & Fredericks", rating: 95, establishment: "Prats & Payne", location: "Streatham Hill", notes: "Dark, robust and full of flavour. Quite strong too. Could only drink one or two pints as it's quite heavy, but it's very tasty." },
    { name: "Hob Goblin", brewery: "Wychwood Brewery Company", rating: 75, establishment: "", location: "", notes: "" },
    { name: "Greene King IPA", brewery: "Greene King", rating: 70, establishment: "", location: "", notes: "" }
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



/*
 *  iOS Only
 *  --------
 */
if (OS_IOS) { 

   // Left & Right buttons in title bar: Edit & New
   
   var addButton = Ti.UI.createButton({ title: "Add" });
   var editButton = Ti.UI.createButton({ title: "Edit" });
   
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
        if (!$.beersTable.editing) {
            $.beersTable.editing = true;
            this.title = "Cancel";
        } else {
            $.beersTable.editing = false;
            this.title = "Edit";
        }
   });
   $.beersTable.addEventListener("delete", function(event) {
      $.beersTable.editing = false;
      this.title = "Edit"; 
      
      setTimeout(function () {
          var beersCollection = Alloy.Collections.beers;
          var beer = beersCollection.get(event.source.alloy_id);
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





