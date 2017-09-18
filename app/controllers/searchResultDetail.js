var args = arguments[0] || {};

//console.log('Search result detail args', args);

var activityIndicator = Ti.UI.createActivityIndicator({
  style: Ti.Platform.name === 'iPhone OS' ? Ti.UI.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK,
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
$.brewery.text = args.brewery;

if (args.style) {
  $.style.text = args.style;
} else {
  $.style.remove();
}


if (args.notes) {
    $.notes.text = args.notes;
} else {
    $.notes.textAlign = "center";
    $.notes.color = Alloy.CFG.colour.grey;
    $.notes.text = L("search_detail_no_notes");
}

var infoPillsData = [];
if (args.percent) {
    infoPillsData.push({text: args.percent+' % abv'});
}
if (args.ibu) {
    infoPillsData.push({text: args.ibu+' ibu'});
}
if (infoPillsData.length) {
    $.infopills.createPills(infoPillsData);
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
		Alloy.Globals.mainTabGroup.setActiveTab(0);
		$.searchResultDetail.close();
	});
    addBeerWin.addBeerButton.addEventListener("click", function () {
       	$.searchResultDetail.add(confirm.getView()); 
    });
    addBeerWin.getView().open();   
});



$.searchResultDetail.addEventListener("close", function () {
	$.destroy();
});
