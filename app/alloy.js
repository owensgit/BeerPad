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

Alloy.Globals.beerListSecondaryValue = 'brewery';

Alloy.Globals.mapLabelText = function($, object) { 

    $.name.text = object.name.toUpperCase();
    
    var breweryAndPercentText = object.percent ? object.brewery + " | " + object.percent : object.brewery;
    
    if (!object.percent  &&  object.brewery) breweryAndPercentText = object.brewery;
    if ( object.percent  &&  object.brewery) breweryAndPercentText = object.brewery + " | " + object.percent + "%";
    if ( object.percent  && !object.brewery) breweryAndPercentText = object.percent + "%";
    
    $.brewery.text = breweryAndPercentText;
    $.pub.text = object.establishment || "No establishment set";
    $.location.text = object.location || "No location set";
    $.notes.text = object.notes;
    
    if (object.beer_image) { $.image.image = object.beer_image; }

    //console.log("The beer image", object.beer_image);

    if (!object.establishment) {
        $.buildingIcon.setImage('buildingGrey.png');
        $.pub.setColor('#b9b9b9');
    };
    if (!object.location) {
        $.locationIcon.setImage('locationGrey.png');
        $.location.setColor('#b9b9b9');
    }
};

Alloy.Globals.getImage = function(alloy_id) {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');  
    return f.read();  
};
