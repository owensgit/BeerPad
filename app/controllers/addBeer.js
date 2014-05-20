var args = arguments[0] || {};
var theBeers = Alloy.Collections.beers;
theBeers.fetch();

var utils = require("utils");


// Array of Star Images for use in applyRating() below

var starArray = [$.star1, $.star2, $.star3, $.star4, $.star5];


   
$.name.hintText = L('add_name');
$.brewery.hintText = L('add_brewery');
$.percent.hintText = L('add_percent');
$.establishment.hintText = L('add_pub');
$.location.hintText = L('add_location');


// Edit Mode

if (args.edit) {
    var editBeer = theBeers.where({"alloy_id": args.alloy_id})[0];
    $.title.text = L("edit_title");   
    $.name.value = args.name;
    $.brewery.value = args.brewery || "";
    $.percent.value = args.percent || "";
    $.establishment.value = args.establishment || "";
    $.location.value = args.location || "";
    
    var beerImage = Alloy.Globals.getImage(args);
    
    if (args.notes) $.notes.value = args.notes;

    $.addBeerButton.title = "Save beer"; 
    
    applyRating(args.rating === null ? 0 : args.rating);  
    
    $.cameraImage.opacity = 0.7;
}



// Stored values for use

var theImage;
var rating;



// Func to map args to modal

function mapArgs() {
    args = {
        name: $.name.value,
        brewery: $.brewery.value,
        rating: rating, // set by applyRating() func below
        percent: $.percent.value,
        establishment: $.establishment.value,
        location: $.location.value,
        notes: $.notes.value
    };

    if (coords) {
        args.latitude = coords.latitude;
        args.longitude = coords.longitude;
    }
    
    if ($.location.value === "") {
        console.log("Location, latitude and longitude set to null, while adding/editing a beer");
        args.latitude = null;
        args.longitude = null;
        args.location = null;
    }
    
    if (!args.date) {
        var now = new Date();
        var now_hours = now.getHours();
        var now_epoch = Math.floor(now.setUTCHours(now_hours));
        args.date = now_epoch; 
        args.date_string = utils.parseDateStringFromEpoch(now_epoch);
    }

    return args;
};



// Percentage validation functions for use in Add Beer Function

function percentNotANumber(percent) {
    var regEx = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/;
    var percent = $.percent.value.replace(/%$/, "");
    if (percent.match(regEx) === null && percent != "") {
        return true;
    }
}
function percentNotValid(percent) {
    var percent = parseInt(percent.replace(/%$/, ""), 10);
    if (percent > 100) {
        return true;
    }
}



// Add Beer Function

$.addBeerButton.addEventListener("click", function () {
    
    this.touchEnabled = false;
    
    // validation...
    
    if (!$.name.value) {
        var dialog = Ti.UI.createAlertDialog({
            title: L('add_error_forgot_name_title'),
            message: L('add_error_forgot_name_msg'),
            ok: L('add_error_forgot_name_ok'),
        }).show();
        this.touchEnabled = true;
        return;
    }
    if (percentNotANumber($.percent.value)) {
        var dialog = Ti.UI.createAlertDialog({
            title: L('add_error_percent_not_num_title'),
            message: L('add_error_percent_not_num_msg'),
            ok: L('add_error_percent_not_num_ok')
        }).show();
        this.touchEnabled = true;
        return;    
    }
    if (percentNotValid($.percent.value)) {
        var dialog = Ti.UI.createAlertDialog({
            title: L('add_error_percent_too_high_title'),
            message: L('add_error_percent_too_high_msg'),
            ok: L('add_error_percent_too_high_ok'),
        }).show();
        this.touchEnabled = true;
        return;    
    }
    
    // temporary overlay while beer is saved to database...
    
    var loadingView = Ti.UI.createView({
        backgroundColor: "rgba(255,255,255,0.6)",
        opacity: 0
    });   
    $.addBeerWin.add(loadingView);
    loadingView.animate({ opacity: 1, duration: 400 });
    
    // saving of the beer
    
    if (args.edit) {
        var updatedArgs = mapArgs();
        editBeer.set(updatedArgs);
        Ti.App.fireEvent("app:updateBeer", { data: updatedArgs });
        
        editBeer.save();
        
        if (theImage) {
            Alloy.Globals.saveImage(editBeer.get('alloy_id'), theImage);
            theImage = null;
            Ti.App.fireEvent("app:updateBeer", { shouldSetImage: true });
        } else {
            Ti.App.fireEvent("app:updateBeer", { shouldSetImage: false });    
        }       
    } else {
        var beer = Alloy.createModel('beers', mapArgs());
        beer.save();           
        theBeers.add(beer);
        
        if (theImage) {
            Alloy.Globals.saveImage(beer.get('alloy_id'), theImage);  
            theImage = null;
        }        
    }
    
    this.touchEnabled = true;
    
    $.addBeerWin.close();
    
});



/*
 *  Add a Photo
 *  -----------
 *  Use Titanium meida API to access device camrea or gallery. On success: 
 *   1. Put the image in the $.beerImage ImageView for the user to see
 *   2. Store the image in global variable 'theImage' (defined above)
 */

var cameraMethods = {
    onSuccess: function (e, imageViewID) {
        if (e.mediaType === Ti.Media.MEDIA_TYPE_PHOTO) {
            $.beerImage.image = e.media;
            theImage = e.media;
            $.cameraImage.opacity = 0.7;
        }
    },
    onCancel: function (e) {
        console.log('Action was cancelled');
    },
    onError: function (e) {
        console.log('An error happened');
    }        
};

$.imageView.addEventListener("click", function (e) { 
      
    var opts = {
      cancel: 2,
      options: [L('add_photo_camera'), L('add_photo_gallery'), L('add_photo_cancel')],
      destructive: 0,
      title: L('add_photo_title')
    };
    
    var dialog = Ti.UI.createOptionDialog(opts);
    
    dialog.addEventListener("click", function (event) {
        if (event.index === 0) {
            Titanium.Media.showCamera({
                success: cameraMethods.onSuccess,
                cancel: cameraMethods.onCancel,
                error: cameraMethods.onError,
                allowEditing: true,
                mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO],
                videoQuality: Titanium.Media.QUALITY_MEDIUM
            });  
        }
        if (event.index === 1) {
            Titanium.Media.openPhotoGallery({
                success: cameraMethods.onSuccess,
                cancel: cameraMethods.onCancel,
                error: cameraMethods.onError,
                allowEditing: true,
                mediaTypes: [Titanium.Media.MEDIA_TYPE_PHOTO],
                videoQuality: Titanium.Media.QUALITY_MEDIUM
            });  
        }             
    });
    
    dialog.show();
}); 




var coords;

function useGPS() {
    
    if (Ti.Geolocation.locationServicesEnabled) {
        
        var activityIndicator = Ti.UI.createActivityIndicator({
          style: Ti.Platform.name === 'iPhone OS' ? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK,
          top: "14dp", //left: "30dp",
          height: "15dp", width: "15dp"
        });
        
        $.locationBox.add(activityIndicator);
        $.location.touchEnabled = false;
        activityIndicator.show();
        
        Ti.Geolocation.purpose = 'Determine Current Location';
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
        Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

        Titanium.Geolocation.getCurrentPosition(function(e) {           
            if (e.error) {
                Ti.API.error('Error: ' + e.error);
                alert(L("location_services_error"));
                activityIndicator.hide();
            } else {               
                coords = e.coords; 
                Ti.Geolocation.reverseGeocoder(e.coords.latitude, e.coords.longitude, function (e) {
                    if (e.error) {
                        alert(L("location_services_error"));   
                        activityIndicator.hide();
                        return;
                    }
                    if (e.places) {
                        activityIndicator.hide();
                        var p = e.places[0];
                        $.location.height = Ti.UI.SIZE;
                        $.location.value = p.street + ", " + p.city + ", " + p.country;
                        $.location.height = Ti.UI.SIZE;
                        $.locationLabel.hide();
                    } else {
                        alert(L("location_services_not_found"));
                        activityIndicator.hide();
                    }
                });    
                $.location.touchEnabled = true;      
            }           
        });
        
    } else {
        alert(L("location_services_disabled"));
    }   
    
}





// Rating

function applyRating(number) {
    rating = number;
    for (var i = 0; i < number; i++) {
        starArray[i].setImage('ratingStarON.png');
    }
    for (var i = number; i < 5; i++) {
        starArray[i].setImage('ratingStar.png');
    }
}

for (var i = 0; i < 5; i++) {
   starArray[i].addEventListener("click", function () {
       applyRating(starArray.indexOf(this) + 1);
   }); 
};



// Misc

function showHideLocationLabel() {
    if ($.location.value === "" || $.location.value === null) {
        $.locationLabel.show();
    } else {
        $.locationLabel.hide();
    }    
}
showHideLocationLabel();
$.location.addEventListener("change", function () {
    showHideLocationLabel();
});

$.addBeerWin.addEventListener("close", function() {
    $.destroy();
});


$.close.addEventListener("click", function () {
    $.addBeerWin.close();
});