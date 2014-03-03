function Controller() {
    function __alloyId6(e) {
        if (e && e.fromAdapter) return;
        __alloyId6.opts || {};
        var models = __alloyId5.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId3 = models[i];
            __alloyId3.__transform = {};
            var __alloyId4 = Ti.UI.createTableViewRow({
                title: "undefined" != typeof __alloyId3.__transform["name"] ? __alloyId3.__transform["name"] : __alloyId3.get("name"),
                brewery: "undefined" != typeof __alloyId3.__transform["brewery"] ? __alloyId3.__transform["brewery"] : __alloyId3.get("brewery"),
                rating: "undefined" != typeof __alloyId3.__transform["rating"] ? __alloyId3.__transform["rating"] : __alloyId3.get("rating"),
                establishment: "undefined" != typeof __alloyId3.__transform["establishment"] ? __alloyId3.__transform["establishment"] : __alloyId3.get("establishment"),
                location: "undefined" != typeof __alloyId3.__transform["location"] ? __alloyId3.__transform["location"] : __alloyId3.get("location"),
                notes: "undefined" != typeof __alloyId3.__transform["notes"] ? __alloyId3.__transform["notes"] : __alloyId3.get("notes")
            });
            rows.push(__alloyId4);
        }
        $.__views.beersTable.setData(rows);
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    Alloy.Collections.instance("beers");
    $.__views.index = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "index"
    });
    $.__views.index && $.addTopLevelView($.__views.index);
    $.__views.beersTable = Ti.UI.createTableView({
        id: "beersTable"
    });
    $.__views.index.add($.__views.beersTable);
    var __alloyId5 = Alloy.Collections["beers"] || beers;
    __alloyId5.on("fetch destroy change add remove reset", __alloyId6);
    exports.destroy = function() {
        __alloyId5.off("fetch destroy change add remove reset", __alloyId6);
    };
    _.extend($, $.__views);
    var theBeers = Alloy.Collections.beers;
    theBeers.fetch();
    var default_beers = [ {
        name: "London Pride",
        brewery: "Fullers",
        rating: 80,
        establishment: "The Queens Head",
        location: "Hammersmith",
        notes: "Very tasty ale, simple and classic! Easy drinking for any occasion. Especially like the slight creamy taste."
    }, {
        name: "Oat Milk Stout",
        brewery: "Clarence & Fredericks",
        rating: 95,
        establishment: "Prats & Payne",
        location: "Streatham Hill",
        notes: "Dark, robust and full of flavour. Quite strong too. Could only drink one or two pints as it's quite heavy, but it's very tasty."
    }, {
        name: "Hob Goblin",
        brewery: "Wychwood Brewery Company",
        rating: 75,
        establishment: "",
        location: "",
        notes: ""
    }, {
        name: "Greene King IPA",
        brewery: "Greene King",
        rating: 70,
        establishment: "",
        location: "",
        notes: ""
    } ];
    _.isEmpty(theBeers.toJSON()) && _.each(default_beers, function(item) {
        var beer = Alloy.createModel("beers", item);
        theBeers.add(beer);
        beer.save();
    });
    $.beersTable.addEventListener("click", function(event) {
        var selectedBeer = event.row;
        var args = {};
        _.each(selectedBeer, function(value, key) {
            args[key] = value;
        });
        var view = Alloy.createController("BeerDetail", args).getView();
        view.open();
    });
    $.index.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;