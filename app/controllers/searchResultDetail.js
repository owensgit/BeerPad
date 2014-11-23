var args = arguments[0] || {};

var activityIndicator = Ti.UI.createActivityIndicator({
  style: Ti.Platform.name === 'iPhone OS' ? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK,
  height:Ti.UI.SIZE, width:Ti.UI.SIZE,
  top: 62
});
    
if (args.beer_image) {
    $.image.add(activityIndicator);
    activityIndicator.show();
    $.image.image = args.beer_image;
} else if (args.brewery_image) {
   $.image.add(activityIndicator);
   activityIndicator.show();
   $.image.image = args.brewery_image; 
}

$.image.addEventListener("load", function () {
	activityIndicator.hide();	
});

$.name.text = args.name.toUpperCase();
$.brewery.text = utils.buildBreweryAndPercentString(args.brewery, args.percent);


if (args.notes) {
    $.notes.text = args.notes;
} else {
    $.notes.textAlign = "center";
    $.notes.color = Alloy.CFG.colour.grey;
    $.notes.text = L("search_detail_no_notes");
}

var addBeerButton = Ti.UI.createButton({ titleid: "search_detail_add_button" });

if (OS_IOS) {       
    $.searchResultDetail.setRightNavButton(addBeerButton);
}


// Add beer - open up addBeer controller, passing in args

addBeerButton.addEventListener("click", function () {
    args.addingFromSearch = true;
    var addBeerWin = Alloy.createController("addBeer", args);
    var confirm = Alloy.createController("confirmationOverlay");
    confirm.overlayBtnLookAgain.addEventListener("click", function () {
    	Ti.App.fireEvent("app:clearLookUpResults");
		$.searchResultDetail.close();
	});
	confirm.overlayBtnMyBeers.addEventListener("click", function () {
		Ti.App.fireEvent("app:clearLookUpResults");
		$.searchResultDetail.close();
		Alloy.Globals.mainTabGroup.setActiveTab(0);
	});
    addBeerWin.addBeerButton.addEventListener("click", function () {
       	$.searchResultDetail.add(confirm.getView()); 
    });
    addBeerWin.getView().open();   
});



$.searchResultDetail.addEventListener("close", function () {
	$.destroy();
});
