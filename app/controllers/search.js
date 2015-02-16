var args = arguments[0] || {};
var data = require("data");
var searchResults = Alloy.Collections.searchResults;


$.searchWin.titleControl = Ti.UI.createImageView({
    image: 'header-search.png', height: Ti.UI.SIZE, width: Ti.UI.SIZE
});



$.resultsView.addEventListener("click", function () {
    $.searchBar.blur();
});
$.searchBar.addEventListener("blur", function () {
    $.resultsTable.height = Ti.UI.FILL;    
});
$.searchBar.addEventListener("focus", function () {
    setTimeout(function () {
        var platformHeight = Ti.Platform.displayCaps.platformHeight;
        $.resultsTable.height = platformHeight - 320;   
    }, 200);
});



function showHideElements(msg) {
    $.noMatchesMsg.animate({opacity: msg === "noMatch" ? 1 : 0, duration: fadeTime});
    $.noConnectionMsg.animate({opacity: msg === "noConnection" ? 1 : 0, duration: fadeTime});
    $.resultsTable.animate({opacity: msg === "resultsTable" ? 1 : 0, duration: fadeTime});
    $.introMsg.animate({opacity: msg === "introMsg" ? 1 : 0, duration: fadeTime});    
}



var fadeTime = 200;

var doSearch = function(searchTerm) {
    data.lookUpBeer(searchTerm, function (results) {
        searchResults.reset();
        if (results === null) {
            $.activityIndicator.hide();
            showHideElements('noConnection');
            return;
        }
        if (_.isEmpty(results)) {
            $.activityIndicator.hide();
            showHideElements('noMatch');
            return;
        }
        $.resultsTable.scrollToTop(0, {animated: false});
        _.each(results, function (item) {
           var beer = Alloy.createModel('searchResults', item);
           searchResults.push(beer);
        });
        showHideElements("resultsTable");
        Alloy.Globals.GA.trackEvent({ category: "AppEvent", action: Alloy.CFG.GA.lookup_api_request, value: 1 });
    });
};

var doSearch_debounced = _.debounce(doSearch, Alloy.CFG.api_call_debounce_delay);

$.searchBar.addEventListener("change", function(e) {
    var searchTerm = this.getValue();
    if (searchTerm.length < 3) {
        showHideElements('introMsg');
        return false;
    }
    showHideElements(null);
    $.activityIndicator.show();
    doSearch_debounced(searchTerm);
});

$.searchBar.addEventListener("return", function(e) {
    var searchTerm = this.getValue();
    showHideElements(null);
    $.activityIndicator.show();
    doSearch_debounced(searchTerm);
});


$.resultsTable.addEventListener("click", function (event) {
    $.resultsTable.height = Ti.UI.FILL;
    Alloy.Globals.openBeerDetails(event, "searchResultDetail");
    Alloy.Globals.GA.trackEvent({ category: "AppEvent", action: Alloy.CFG.GA.lookup_api_used, value: 1 });
});


Ti.App.addEventListener("app:clearLookUpResults", function(event) {
	searchResults.reset();
	showHideElements('introMsg');	
	$.searchBar.setValue("");
});



$.searchWin.addEventListener("focus", function () {
	Alloy.Globals.GA.trackScreen({ screenName: "Look Up" });
});