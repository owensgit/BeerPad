var utils = require("utils");
var locationLookUp = require("locationLookUp");
var locLookUp = new locationLookUp();

var args = arguments[0] || {};
var theBeers = Alloy.Collections.beers;
theBeers.fetch();


// Array of Star Images for use in applyRating() below

var starArray = [$.star1, $.star2, $.star3, $.star4, $.star5];


// Activity indcator used in the location box view

var locActivityIndicator = Ti.UI.createActivityIndicator({
  style: Ti.Platform.name === 'iPhone OS' ? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.DARK,
  top: "15dp", right: "40dp",
  height: "15dp", width: "15dp"
});
$.locationBox.add(locActivityIndicator);



// Initial placeholder values

var theImage;
var rating;
var coords;
var locSearchResults = null;


   
   
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







// Func to map args to modal

function mapArgs() {
    var newArgs = {
        name: $.name.value,
        brewery: $.brewery.value,
        rating: rating, // set by applyRating() func below
        percent: $.percent.value,
        establishment: $.establishment.value,
        location: $.location.value,
        notes: $.notes.value
    };

    if (coords) {
        newArgs.latitude = coords.latitude;
        newArgs.longitude = coords.longitude;
    }
    
    if ($.location.value === "") {
        newArgs.latitude = null;
        newArgs.longitude = null;
        newArgs.location = null;
    }
    
    if (!args.date) {
        var now = new Date();
        var now_hours = now.getHours();
        var now_epoch = Math.floor(now.setUTCHours(now_hours));
        newArgs.date = now_epoch; 
        newArgs.date_string = utils.parseDateStringFromEpoch(now_epoch);
    }

    return newArgs;
};




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
    
    if (utils.perentageIsValid($.percent.value) === false) {
        this.touchEnabled = true;
        return;
    }
    
    // temporary overlay while beer is saved to database...
    var loadingView = Ti.UI.createView({ backgroundColor: "rgba(255,255,255,0.6)", opacity: 0 });   
    $.addBeerWin.add(loadingView);
    loadingView.animate({ opacity: 1, duration: 400 });
    
    
    // saving of the beer
    
    if (args.edit) {
        var updatedData = mapArgs();
        editBeer.set(updatedData);
        var shouldSetImage = theImage ? true : false;
        editBeer.save();
        
        if (theImage) {
            Alloy.Globals.saveImage(editBeer.get('alloy_id'), theImage);
        }

        Ti.App.fireEvent("app:updateBeer", { 
            updatedData: updatedData,
            shouldSetImage: shouldSetImage 
        });           
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



// Add Photo

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


// Functions to show or hide location information

function showHideLocationLabel() {
    if ($.location.value === "" || $.location.value === null) {
        $.locationLabel.show();
    } else {
        $.locationLabel.hide();
    }    
}
showHideLocationLabel();

function showHideLocSearchResults() {
    if (locSearchResults) {
        $.locationBox.remove(locSearchResults);
        locSearchResults = null;     
    } 
}


// Location Look Up

$.location.addEventListener("focus", function (e) {
    setTimeout(function() { $.scrollView.scrollTo(0, 450); }, 300);
});

$.location.addEventListener("change", function (e) {
    var searchTerm = this.getValue();
    
    if (searchTerm.length >= 3) { 
        locActivityIndicator.show(); 
    };
    
    showHideLocationLabel();
    
    utils.waitForFinalEvent(function() {
        if (searchTerm.length >= 3) { 
                  
            showHideLocSearchResults();
                    
            locLookUp.lookUpAddress(searchTerm, function (results) {
                
                if (!results) {
                    locActivityIndicator.hide();
                    return;
                }
                
                locSearchResults = Ti.UI.createView({
                    height: Ti.UI.SIZE, width: Ti.UI.SIZE, top: "46dp", bottom: "5dp",
                    backgroundColor: "#FFFFFF", borderColor: "#b0b0b0", borderRadius: "5dp"
                });
                var resultsTable = locLookUp.createResultsTable();
                locSearchResults.add(resultsTable);
                
                $.locationBox.add(locSearchResults);
                locActivityIndicator.hide();
                
                resultsTable.addEventListener("click", function (e) {
                    showHideLocSearchResults();
                    $.location.value = e.rowData.title;
                    coords = e.rowData.coords; 
                });
            });
            
        } else {
            showHideLocSearchResults(); 
            locActivityIndicator.hide();   
        }
    }, 600, "Perform address search");
});


// On click event for Use Location Services

function useGPS() {
    
    showHideLocSearchResults();
    
    if (Ti.Geolocation.locationServicesEnabled) {
        $.location.touchEnabled = false;
        locActivityIndicator.show();
        
        Ti.Geolocation.purpose = 'Determine Current Location';
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
        Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

        Titanium.Geolocation.getCurrentPosition(function(e) {           
            if (e.error) {
                $.location.touchEnabled = true; locActivityIndicator.hide();
                alert(L("location_services_error"));
            } else {               
                coords = e.coords; 
                Ti.Geolocation.reverseGeocoder(e.coords.latitude, e.coords.longitude, function (e) {
                    if (e.error) {
                        alert(L("location_services_error"));
                    } else if (e.places) {
                        var p = e.places[0];
                        $.location.value = p.street + ", " + p.city + ", " + p.country;
                        $.location.height = Ti.UI.SIZE;
                        $.locationLabel.hide();
                    } else {
                        alert(L("location_services_not_found"));
                    }
                    $.location.touchEnabled = true; locActivityIndicator.hide();
                });             
            }           
        });       
    } else {
        $.location.touchEnabled = true; locActivityIndicator.hide();
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

$.addBeerWin.addEventListener("close", function() {
    $.destroy();
});

$.close.addEventListener("click", function () {
    $.addBeerWin.close();
});