var args = arguments[0] || {};

var theBeers = Alloy.Collections.beers;
theBeers.fetch();

Ti.App.addEventListener("addToFavorites", function (e) {
   theBeers.fetch();
});

$.beersTable.addEventListener("click", function(event) {
    Alloy.Globals.openBeerDetails(event, theBeers);
});

function transformFunction(modal) {
    return Alloy.Globals.beerListTransform(modal);
} 

// Show only book models by Mark Twain
function filterFunction(collection) {
    return collection.where({favourite: 1 });
}

var filterDialog = Alloy.Globals.returnSortingDialog(theBeers);

var sortButton = Ti.UI.createButton({ titleid: "index_sort_btn" });
$.favListWin.setLeftNavButton(sortButton);

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