var args = arguments[0] || {};

var theBeers = Alloy.Collections.beers;
theBeers.fetch();

if (!_.isEmpty(theBeers.where({favourite: 1 }))) {
    $.favTable.visible = true;
}
theBeers.on("change", function () {
    if (_.isEmpty(theBeers.where({favourite: 1 }))) {
        Ti.App.fireEvent("toggleFavTable", { visible: false });        
    } else {
       Ti.App.fireEvent("toggleFavTable", { visible: true }); 
    }
});

Ti.App.addEventListener("toggleFavTable", function (e) {
    $.favTable.setVisible(e.visible);    
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
var addButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.ADD });

if (OS_IOS) {
    $.favListWin.setLeftNavButton(sortButton);   
    $.favListWin.setRightNavButton(addButton);
}

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

$.favTable.addEventListener("delete", function(event) {
   setTimeout(function () {
       var beersCollection = Alloy.Collections.beers;
       var beer = beersCollection.get(event.rowData.alloy_id);
       beer.destroy();
   }, 500);
});