var args = arguments[0] || {};
var data = require("data");

var searchResults = Alloy.createCollection("searchResults");

$.resultsView.addEventListener("click", function () {
    $.searchBar.blur();
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
        if (results === null) {
            $.activityIndicator.hide();
            showHideElements('noConnection');
            return;
        }
        if (!results) {
            $.activityIndicator.hide();
            showHideElements('noMatch');
            return;
        }
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
