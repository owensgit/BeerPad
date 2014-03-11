function Controller() {
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "editBeer";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.editBeer = Ti.UI.createWindow({
        backgroundColor: "white",
        barColor: "#f8ac12",
        backButtonTitle: "Back",
        titleAttributes: {
            color: "#FFFFFF"
        },
        title: "Edit",
        id: "editBeer"
    });
    $.__views.editBeer && $.addTopLevelView($.__views.editBeer);
    exports.destroy = function() {};
    _.extend($, $.__views);
    arguments[0] || {};
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;