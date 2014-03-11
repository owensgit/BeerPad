function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "addBeer";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.addBeerWin = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#f8ac12",
        backButtonTitle: "Back",
        titleAttributes: {
            color: "#FFFFFF"
        },
        id: "addBeerWin",
        title: "Add a beer",
        modal: "true"
    });
    $.__views.addBeerWin && $.addTopLevelView($.__views.addBeerWin);
    $.__views.__alloyId0 = Ti.UI.createScrollView({
        layout: "vertical",
        id: "__alloyId0"
    });
    $.__views.addBeerWin.add($.__views.__alloyId0);
    $.__views.close = Ti.UI.createButton({
        color: "#f8ac12",
        top: "30dp",
        title: "close",
        id: "close"
    });
    $.__views.__alloyId0.add($.__views.close);
    $.__views.title = Ti.UI.createLabel({
        top: "10dp",
        font: {
            fontSize: "28dp"
        },
        id: "title",
        text: "Add a beer"
    });
    $.__views.__alloyId0.add($.__views.title);
    $.__views.imageView = Ti.UI.createView({
        id: "imageView",
        top: "20",
        height: "130",
        width: "130",
        backgroundColor: "yellow"
    });
    $.__views.__alloyId0.add($.__views.imageView);
    $.__views.beerImage = Ti.UI.createImageView({
        id: "beerImage",
        height: "130",
        width: "130"
    });
    $.__views.imageView.add($.__views.beerImage);
    $.__views.__alloyId1 = Ti.UI.createLabel({
        text: "Add image",
        id: "__alloyId1"
    });
    $.__views.imageView.add($.__views.__alloyId1);
    $.__views.name = Ti.UI.createTextField({
        top: "20dp",
        id: "name",
        hintText: "Title..."
    });
    $.__views.__alloyId0.add($.__views.name);
    $.__views.brewery = Ti.UI.createTextField({
        top: "20dp",
        id: "brewery",
        hintText: "Author..."
    });
    $.__views.__alloyId0.add($.__views.brewery);
    $.__views.rating = Ti.UI.createTextField({
        top: "20dp",
        id: "rating",
        hintText: "Rating..."
    });
    $.__views.__alloyId0.add($.__views.rating);
    $.__views.establishment = Ti.UI.createTextField({
        top: "20dp",
        id: "establishment",
        hintText: "Establishment..."
    });
    $.__views.__alloyId0.add($.__views.establishment);
    $.__views.location = Ti.UI.createTextField({
        top: "20dp",
        id: "location",
        hintText: "Location..."
    });
    $.__views.__alloyId0.add($.__views.location);
    $.__views.notes = Ti.UI.createTextField({
        top: "20dp",
        clearOnEdit: "true",
        height: Ti.UI.SIZE,
        id: "notes",
        hintText: "Notes...",
        width: Ti.Platform.displayCaps.platformWidth
    });
    $.__views.__alloyId0.add($.__views.notes);
    $.__views.addBeerButton = Ti.UI.createButton({
        color: "#f8ac12",
        top: "40dp",
        font: {
            fontSize: "18dp"
        },
        title: "Add",
        id: "addBeerButton"
    });
    $.__views.__alloyId0.add($.__views.addBeerButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var theBeers = Alloy.Collections.beers;
    theBeers.fetch();
    if (args.edit) {
        var editBeer = theBeers.where({
            alloy_id: args.alloy_id
        })[0];
        $.title.text = "Edit " + args.title;
        console.log(editBeer.toJSON());
        editBeer.set({
            name: "Happy juice"
        });
        editBeer.save();
        $.name.value = args.title;
        $.brewery.value = args.brewery || "";
        $.rating.value = args.rating || "";
        $.establishment.value = args.establishment || "";
        $.location.value = args.location || "";
        args.notes && ($.notes.value = args.notes);
    } else $.addBeerWin.addEventListener("open", function() {
        $.name.focus();
    });
    var theImage;
    $.close.addEventListener("click", function() {
        $.addBeerWin.close();
    });
    $.addBeerButton.addEventListener("click", function() {
        if (!$.name.value) {
            Ti.UI.createAlertDialog({
                message: "Had one beer too many?\nYou forgot to add a name!",
                ok: "Okay",
                title: "Missing Name"
            }).show();
            return;
        }
        var beer = Alloy.createModel("beers", {
            name: $.name.value,
            brewery: $.brewery.value,
            rating: $.rating.value,
            establishment: $.establishment.value,
            location: $.location.value,
            notes: $.notes.value
        });
        theBeers.add(beer);
        beer.save();
        var alloy_id = beer.get("alloy_id");
        var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + ".jpg");
        f.write(theImage);
        $.addBeerWin.close();
    });
    var cameraMethods = {
        onSuccess: function(e) {
            if (e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
                $.beerImage.image = e.media;
                theImage = e.media;
            }
        },
        onCancel: function() {
            console.log("Action was cancelled");
        },
        onError: function() {
            console.log("An error happened");
        }
    };
    $.imageView.addEventListener("click", function() {
        $.beerImage;
        Titanium.Media.showCamera({
            success: cameraMethods.onSuccess,
            cancel: cameraMethods.onCancel,
            error: cameraMethods.onError,
            allowEditing: true,
            mediaTypes: [ Titanium.Media.MEDIA_TYPE_PHOTO ],
            videoQuality: Titanium.Media.QUALITY_HIGH
        });
    });
    $.addBeerWin.addEventListener("close", function() {
        $.destroy();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;