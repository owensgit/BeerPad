var args = arguments[0] || {};

var theBeers = Alloy.Collections.beers;
theBeers.fetch();

if (!_.isEmpty(theBeers.where({favourite: 1 }))) {
    $.favTable.visible = true;
}
theBeers.on("change", function () {
    console.log(!_.isEmpty(theBeers.where({favourite: 1 })));
    if (!_.isEmpty(theBeers.where({favourite: 1 }))) {
        Ti.App.fireEvent("toggleFavTable");        
    } 
});

Ti.App.addEventListener("toggleFavTable", function () {
    $.favTable.setVisible(true);    
});

$.favTable.addEventListener("click", function(event) {
    Alloy.Globals.openBeerDetails(event, theBeers);
});

function transformFunction(modal) {
    return Alloy.Globals.beerListTransform(modal);
} 

function filterFunction(collection) {
    return collection.where({favourite: 1 });
}

var filterDialog = Alloy.Globals.returnSortingDialog(theBeers);

var sortButton = Ti.UI.createButton({ titleid: "index_sort_btn" });
$.favListWin.setLeftNavButton(sortButton);

sortButton.addEventListener("click", function(event) {
    filterDialog.show();
});

$.favTable.addEventListener("delete", function(event) {
   setTimeout(function () {
       var beersCollection = Alloy.Collections.beers;
       var beer = beersCollection.get(event.rowData.alloy_id);
       beer.destroy();
   }, 500);
});