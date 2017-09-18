var theBeers = Alloy.Collections.beers;
theBeers.fetch();

//console.log('theBeers', theBeers.toJSON());

/*var DB_NAME = L("framework_database_name", "_alloy_");

var db = Titanium.Database.open(DB_NAME);

console.log("DB remote backup is ", db.file.remoteBackup);*/


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
var addButton = Ti.UI.createButton();
var searchButton = Ti.UI.createButton();
var sortButton = Ti.UI.createButton({ titleid: "index_sort_btn" });
var filterButton = Ti.UI.createButton({ title: "Filter" });

if (OS_IOS) {    
    addButton.setSystemButton(Ti.UI.iOS.SystemButton.ADD);
    searchButton.setSystemButton(Ti.UI.iOS.SystemButton.SEARCH); 
    $.beerListWin.setRightNavButton(addButton);
    $.beerListWin.setLeftNavButton(sortButton);
}


// Add a new beer
addButton.addEventListener("click", function () {
    var window = Alloy.createController('addBeer').getView();
        window.open({
            modal:true,
            modalTransitionStyle: Ti.UI.iOS.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iOS.MODAL_PRESENTATION_FORMSHEET
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

