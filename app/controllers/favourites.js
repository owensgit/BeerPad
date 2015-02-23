var args = arguments[0] || {};

var theBeers = Alloy.Collections.beers;
theBeers.fetch();


$.favListWin.titleControl = Ti.UI.createImageView({
    image: 'header-favourites.png', 
    height: Ti.UI.SIZE, 
    width: Ti.UI.SIZE
});

if (!_.isEmpty(theBeers.where({favourite: 1 }))) {
    $.favTable.visible = true;
} else {
    $.favTable.visible = false;    
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
    Alloy.Globals.openBeerDetails(event);
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
   var favourites = theBeers.where({favourite: 1 });
   
   if (!Ti.App.Properties.getString('seenDeleteFromFavouritesMessage')) { 
       var dialog = Ti.UI.createAlertDialog({
            title: L('fav_delete_alert_title'),
            message: L('fav_delete_alert_msg'),
            ok: L('fav_delete_alert_ok'),
        }).show();
       Ti.App.Properties.setString('seenDeleteFromFavouritesMessage', true);
   }
   
   var args = {
        favourite: 1,
        alloy_id: event.rowData.alloy_id
   };
   if (favourites.length === 1) {
     Ti.App.fireEvent("app:addToFavorites", { args: args }); 
   } else {
     setTimeout(function () {   
       Ti.App.fireEvent("app:addToFavorites", { args: args });
     }, 400);    
   };
   
});


$.favListWin.addEventListener("focus", function () {
	//Alloy.Globals.GA.trackScreen({ screenName: "Favourties" });
});