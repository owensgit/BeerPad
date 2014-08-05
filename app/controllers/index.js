var theBeers = Alloy.Collections.beers;
theBeers.fetch();

Alloy.Globals.mainTabGroup = $.mainTabGroup;

$.beerListWin.titleControl = Ti.UI.createImageView({
    image: 'header-logo.png', 
    height: Ti.UI.SIZE, 
    width: Ti.UI.SIZE
});

$.beersTable.addEventListener("click", function(event) {
    Alloy.Globals.openBeerDetails(event);
});

function transformFunction(modal) {
    return Alloy.Globals.beerListTransform(modal);
}


var filterDialog = Alloy.Globals.returnSortingDialog(theBeers);


// Left & Right buttons in title bar: Edit & New
var addButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.ADD });
var sortButton = Ti.UI.createButton({ titleid: "index_sort_btn" });

if (OS_IOS) {       
    $.beerListWin.setRightNavButton(addButton);
    $.beerListWin.setLeftNavButton(sortButton);
}
   
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

/*$.beersTable.addEventListener("focus", function () {
    Alloy.Globals.GoogleAnalytics.trackScreen("Index"); 
});*/

