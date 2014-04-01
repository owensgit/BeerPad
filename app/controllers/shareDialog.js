var args = arguments[0] || {};

var social = require("social_plus");


function shareEmail() {
    var emailDialog = Titanium.UI.createEmailDialog();
    emailDialog.html = true;
    emailDialog.subject = "Check out this beer";
    
    var msg = "Check this beer I've tried, it's called " + args.name + "<br>.";
    
    if (args.brewery) {
        msg = msg + "<br>Name: " + args.name + "<br>";
        msg = msg + "Brewery: " + args.brewery + "<br>";
    }
    if (args.percent) {
        msg = msg + "Percent: " + args.percent + "%<br>";
    }
    if (args.pub) {
        msg = msg + "Pub: " + args.pub + "<br>";
    }
    if (args.location) {
        msg = msg + "Location: " + args.location + "<br>";
    }
    if (args.note) {
        msg = msg + "Notes: " + args.notes + "<br>";
    }
     
    emailDialog.messageBody = msg;
    emailDialog.open();
    
    $.shareDialog.animate({
        bottom: "-250dp"
    });
};

function shareTwitter() {
    
    $.shareDialog.animate({
        bottom: "-250dp"
    });
    
    // Create a Twitter client for this module
    var twitter = social.create({
        consumerSecret : Alloy.CFG.twitter.consumerSecret,
        consumerKey : Alloy.CFG.twitter.consumerKey
    });

    twitter.shareImage({
        message : "Test image upload with appcelerator & social.js on android",
        image : (Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "KS_nav_ui.png")).read(),
        success : function() {
            var dialog = Ti.UI.createAlertDialog({
                message: 'Your tweet has been sent, now the world can share your love of beer',
                ok: 'Great!',
                title: 'Tweet Sent!'
            }).show();
        },
        error : function() {
            alert('There was an error, please try again.');
        }
    });
};

function close() {
    $.shareDialog.animate({
        bottom: "-250dp"
    });
}
