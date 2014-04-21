var theBeers = Alloy.Collections.beers;
theBeers.fetch();

// Set of defaults to load if no current data is present

var default_beers = [
    { date: "1391377283743", name: "London Pride", brewery: "Fullers", rating: 4, percent: 3.4, establishment: "The Queens Head", location: "Hammersmith", notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste." },
    { date: "1392068483743", name: "Red Currant Stout", brewery: "Clarence & Fredericks", percent: 5.4, rating: 5, establishment: "Prats & Payne", location: "Streatham Hill", notes: "Dark, robust and full of flavour with currant flavours. Quite strong and heavy, so perhaps better to drink by the half.", beer_image: "sample_redcurrantstout.jpg" },
    { date: "1393537283743", name: "Hob Goblin", brewery: "Wychwood Brewery Company", percent: 4.3, rating: 3, establishment: "The White Lion", location: "Stretham Hill", notes: "Great, full falvoured ale with lots of character. Be careful with this one, it's got a pretty high percentage!", beer_image: "sample_hobgoblin.jpg" },
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
        var beer = Alloy.createModel('beers', item);
        theBeers.add(beer);    
        beer.save();
    });
}

Alloy.Globals.mainTabGroup = $.mainTabGroup;


$.beersTable.addEventListener("click", function(event) {
    Alloy.Globals.openBeerDetails(event, theBeers, $.tab1);
});

function transformFunction(modal) {
    return Alloy.Globals.beerListTransform(modal);
}


var filterDialog = Alloy.Globals.returnSortingDialog(theBeers);


// Left & Right buttons in title bar: Edit & New
var addButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.ADD });
var sortButton = Ti.UI.createButton({ titleid: "index_sort_btn" });
   
$.beerListWin.setRightNavButton(addButton);
$.beerListWin.setLeftNavButton(sortButton);
   
// Add a new beer
addButton.addEventListener("click", function () {
    var window = Alloy.createController('addBeer').getView();
        window.open({
            modal:true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
});
   
sortButton.addEventListener("click", function(event) {
    filterDialog.show();
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
   $.mainTabGroup.open();  
} else {
   welcome.open();
}



