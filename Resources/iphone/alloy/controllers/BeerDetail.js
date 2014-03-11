function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "BeerDetail";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.BeerDetail = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#f8ac12",
        backButtonTitle: "Back",
        titleAttributes: {
            color: "#FFFFFF"
        },
        layout: "vertical",
        id: "BeerDetail"
    });
    $.__views.BeerDetail && $.addTopLevelView($.__views.BeerDetail);
    $.__views.image = Ti.UI.createImageView({
        id: "image"
    });
    $.__views.BeerDetail.add($.__views.image);
    $.__views.name = Ti.UI.createLabel({
        id: "name"
    });
    $.__views.BeerDetail.add($.__views.name);
    $.__views.brewery = Ti.UI.createLabel({
        id: "brewery"
    });
    $.__views.BeerDetail.add($.__views.brewery);
    $.__views.rating = Ti.UI.createLabel({
        id: "rating"
    });
    $.__views.BeerDetail.add($.__views.rating);
    $.__views.establishment = Ti.UI.createLabel({
        id: "establishment"
    });
    $.__views.BeerDetail.add($.__views.establishment);
    $.__views.location = Ti.UI.createLabel({
        id: "location"
    });
    $.__views.BeerDetail.add($.__views.location);
    $.__views.notes = Ti.UI.createLabel({
        id: "notes"
    });
    $.__views.BeerDetail.add($.__views.notes);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var args = arguments[0] || {};
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, args.alloy_id + ".jpg");
    var contents = f.read();
    $.BeerDetail.setTitle(args.title);
    $.image.image = contents;
    $.name.text = args.title;
    $.brewery.text = args.brewery;
    $.rating.text = args.rating;
    $.establishment.text = args.establishment;
    $.location.text = args.location;
    $.notes.text = args.notes;
    var editButton = Ti.UI.createButton({
        title: "Edit"
    });
    $.BeerDetail.setRightNavButton(editButton);
    editButton.addEventListener("click", function() {
        args.edit = true;
        var window = Alloy.createController("addBeer", args).getView();
        window.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;