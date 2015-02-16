var theBeers = Alloy.Collections.beers;
theBeers.fetch();

Alloy.Globals.mainTabGroup = $.mainTabGroup;

$.beerListWin.titleControl = Ti.UI.createImageView({
    image: 'header-logo.png', height: Ti.UI.SIZE, width: Ti.UI.SIZE
});

function transformFunction(modal) {
    return Alloy.Globals.beerListTransform(modal);
}

$.beersTable.addEventListener("click", function(event) {
    Alloy.Globals.openBeerDetails(event);
});

$.beersTable.addEventListener("delete", function(event) {
   setTimeout(function () {
       var beersCollection = Alloy.Collections.beers;
       var beer = beersCollection.get(event.rowData.alloy_id);
       beer.destroy();
   }, 500);
});


// Left & Right buttons in title bar: Edit & New
var addButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.ADD });
var searchButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.SEARCH });
var sortButton = Ti.UI.createButton({ titleid: "index_sort_btn" });
var filterButton = Ti.UI.createButton({ title: "Filter" });

if (OS_IOS) {       
    $.beerListWin.setRightNavButton(searchButton);
    $.beerListWin.setLeftNavButtons([sortButton, filterButton]);
}


var searchBar = Titanium.UI.createSearchBar({
    barColor:'#000', 
    showCancel: true,
    height: 43
});
$.beersTable.setSearchHidden(true);
$.beersTable.setSearch(searchBar);


$.beerListWin.addEventListener("focus",function(){
    $.beersTable.setSearchHidden(true);

    setTimeout(function () {
        searchBar.show();
    },1000);
});

/*searchBar.addEventListener("cancel", function () {
	searchBar.animate({ opacity: 0, height: 0, duration: 500 }, function () {
		$.beersTable.setSearch(null);
	});	
});
searchButton.addEventListener("click", function () {
	searchBar.opacity = 1;
  $.beersTable.setSearch(searchBar);
  searchBar.focus();
});*/

// Add a new beer
addButton.addEventListener("click", function () {
    var window = Alloy.createController('addBeer').getView();
        window.open({
            modal:true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
    });
});

// Sort beers
var filterDialog = Alloy.Globals.returnSortingDialog(theBeers);
   
sortButton.addEventListener("click", function(event) {
    filterDialog.show();
});
   

// Open the main app window
var welcome = Alloy.createController("welcome").getView();
if (Ti.App.Properties.getString("welcomeDone") === "true") {
   $.mainTabGroup.open();  
} else {
   welcome.open();
}


$.beerListWin.addEventListener("focus", function () {
  Alloy.Globals.GA.trackScreen({ screenName: "My Beers" });
});

