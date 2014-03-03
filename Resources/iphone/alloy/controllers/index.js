function Controller() {
    function __alloyId8(e) {
        if (e && e.fromAdapter) return;
        __alloyId8.opts || {};
        var models = __alloyId7.models;
        var len = models.length;
        var rows = [];
        for (var i = 0; len > i; i++) {
            var __alloyId4 = models[i];
            __alloyId4.__transform = {};
            var __alloyId6 = Ti.UI.createTableViewRow({
                hasChild: "true",
                beerId: "undefined" != typeof __alloyId4.__transform["alloy_id"] ? __alloyId4.__transform["alloy_id"] : __alloyId4.get("alloy_id"),
                title: "undefined" != typeof __alloyId4.__transform["name"] ? __alloyId4.__transform["name"] : __alloyId4.get("name"),
                brewery: "undefined" != typeof __alloyId4.__transform["brewery"] ? __alloyId4.__transform["brewery"] : __alloyId4.get("brewery"),
                rating: "undefined" != typeof __alloyId4.__transform["rating"] ? __alloyId4.__transform["rating"] : __alloyId4.get("rating"),
                establishment: "undefined" != typeof __alloyId4.__transform["establishment"] ? __alloyId4.__transform["establishment"] : __alloyId4.get("establishment"),
                location: "undefined" != typeof __alloyId4.__transform["location"] ? __alloyId4.__transform["location"] : __alloyId4.get("location"),
                notes: "undefined" != typeof __alloyId4.__transform["notes"] ? __alloyId4.__transform["notes"] : __alloyId4.get("notes")
            });
            rows.push(__alloyId6);
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
    $.__views.beerListWin = Ti.UI.createWindow({
        backgroundColor: "white",
        id: "beerListWin",
        title: "BeerDiary"
    });
    $.__views.beersTable = Ti.UI.createTableView({
        id: "beersTable",
        editable: "true",
        allowsSelectionDuringEditing: "true"
    });
    $.__views.beerListWin.add($.__views.beersTable);
    var __alloyId7 = Alloy.Collections["beers"] || beers;
    __alloyId7.on("fetch destroy change add remove reset", __alloyId8);
    $.__views.navGroupWin = Ti.UI.iOS.createNavigationWindow({
        window: $.__views.beerListWin,
        id: "navGroupWin"
    });
    $.__views.navGroupWin && $.addTopLevelView($.__views.navGroupWin);
    exports.destroy = function() {
        __alloyId7.off("fetch destroy change add remove reset", __alloyId8);
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
        $.navGroupWin.openWindow(view);
    });
    var addButton = Ti.UI.createButton({
        title: "Add"
    });
    var editButton = Ti.UI.createButton({
        title: "Edit"
    });
    $.beerListWin.setRightNavButton(addButton);
    $.beerListWin.setLeftNavButton(editButton);
    addButton.addEventListener("click", function() {
        var window = Alloy.createController("addBeer").getView();
        window.open({
            modal: true,
            modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
            modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
    });
    editButton.addEventListener("click", function() {
        if ($.beersTable.editing) {
            $.beersTable.editing = false;
            this.title = "Edit";
        } else {
            $.beersTable.editing = true;
            this.title = "Cancel";
        }
    });
    $.beersTable.addEventListener("delete", function(event) {
        $.beersTable.editing = false;
        this.title = "Edit";
        setTimeout(function() {
            var beersCollection = Alloy.Collections.beers;
            var beer = beersCollection.get(event.source.beerId);
            beer.destroy();
        }, 500);
    });
    $.navGroupWin.open();
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;