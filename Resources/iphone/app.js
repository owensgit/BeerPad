var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.mapLabelText = function($, object) {
    $.name.text = object.name.toUpperCase();
    $.brewery.text = object.brewery;
    $.rating.text = object.rating;
    $.establishment.text = object.establishment;
    $.location.text = object.location;
    $.notes.text = object.notes;
};

Alloy.createController("index");