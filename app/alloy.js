// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};


Alloy.Globals.mapLabelText = function($, object) { 

    $.name.text = object.name.toUpperCase();
    $.brewery.text = object.brewery;
    $.pub.text = object.establishment || "No establishment set";
    $.location.text = object.location || "No location set";
    $.notes.text = object.notes;

    if (!object.establishment) {
        $.buildingIcon.setImage('buildingGrey.png');
        $.establishment.setColor('#b9b9b9');
    };
    if (!object.location) {
        $.locationIcon.setImage('locationGrey.png');
        $.location.setColor('#b9b9b9');
    }
};