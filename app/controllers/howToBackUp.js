function closeWindow() {
    $.howToBackUpWin.close();
}

$.content.addEventListener('beforeload', function(e) {
    if (e.navigationType == Titanium.UI.iOS.WEBVIEW_NAVIGATIONTYPE_LINK_CLICKED) {
        // stop the event
        e.bubble = false;
        // stop the url from loading
        $.content.stopLoading();
        // open in safari
        Ti.Platform.openURL(e.url);
    }
});