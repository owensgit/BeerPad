function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "beerPictures";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.imageView = Ti.UI.createView({
        id: "imageView",
        top: "20",
        height: "130",
        width: "130",
        backgroundColor: "yellow"
    });
    $.__views.imageView && $.addTopLevelView($.__views.imageView);
    $.__views.beerImage = Ti.UI.createImageView({
        id: "beerImage",
        height: "130",
        width: "130"
    });
    $.__views.imageView.add($.__views.beerImage);
    $.__views.__alloyId2 = Ti.UI.createLabel({
        text: "Add image",
        id: "__alloyId2"
    });
    $.__views.imageView.add($.__views.__alloyId2);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    var theImage;
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
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;