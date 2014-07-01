var args = arguments[0] || {};

function sendFeedback() {
    var emailDialog = Titanium.UI.createEmailDialog();
    var appDetails = '<br><br><br><small><b>App Version:</b> ' + Titanium.App.version;
    var osDetails = '<b>OS:</b> ' + Titanium.Platform.osname + '<br><b>Platform:</b> ' + Titanium.Platform.name + '<br><b>Version:</b> ' + Titanium.Platform.version + '<br><b>Model:</b> ' + Titanium.Platform.model + '</small>';
    emailDialog.html = true;
    emailDialog.subject = "Beer Pad Feedback";
    emailDialog.messageBody = '<br>' + appDetails + '<br>' + osDetails;
    emailDialog.toRecipients = [Alloy.CFG.feedback_email];
    emailDialog.open();
};

function rateButton() {
    var url = Alloy.CFG.app_store_url;
    console.log(url);
    Ti.Platform.openURL(url);    
}

$.versionNumber.text = "Version " + Ti.App.getVersion();

/*$.about.addEventListener("focus", function () {
    Alloy.Globals.GoogleAnalytics.trackScreen("About");  
});*/
