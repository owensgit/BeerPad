// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// args. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

Alloy.Globals.beerListSecondaryValue = 'brewery';

Alloy.Globals.mapLabelText = function($, args) { 

    $.name.text = args.name.toUpperCase();
    
    var breweryAndPercentText = args.percent ? args.brewery + " | " + args.percent : args.brewery;
    
    if (!args.percent  &&  args.brewery) breweryAndPercentText = args.brewery;
    if ( args.percent  &&  args.brewery) breweryAndPercentText = args.brewery + " | " + args.percent + "%";
    if ( args.percent  && !args.brewery) breweryAndPercentText = args.percent + "%";
    
    $.brewery.text = breweryAndPercentText;
    $.pub.text = args.establishment || L("detail_no_pub");
    $.location.text = args.location || L("detail_no_location");
    $.notes.text = args.notes;
    
    var theImage = Alloy.Globals.getImage(args);
    
    if (theImage) {
        $.image.image = theImage;   
    }

    if (!args.establishment) {
        $.buildingIcon.setImage('buildingGrey.png');
        $.pub.setColor('#b9b9b9');
    };
    if (!args.location) {
        $.locationIcon.setImage('locationGrey.png');
        $.location.setColor('#b9b9b9');
    }
};

Alloy.Globals.getImage = function(args) {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, args.alloy_id + '.jpg');  
    var fileSystemImage = f.read();  
    if (fileSystemImage) {
        return fileSystemImage;
    }
    if (args.beer_image) {
        if (args.beer_image.indexOf("sample_") === 0) {
            return args.beer_image;
        }
    }
};

Alloy.Globals.saveImage = function(alloy_id, theImage) {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, alloy_id + '.jpg');
    f.write(theImage);  
};