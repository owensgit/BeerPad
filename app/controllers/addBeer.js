/*
 * @file Manages adding or editing a beer
 * @author Owen Evans
 */
var moment = require('alloy/moment');
var utils = require("/utils");
var datePicker = require("/datePicker");
var data = require("data");
var lookUpView = require('lookUpView');
var reviewPrompt = require('reviewPrompt');

// Get args and beers collection
var args = arguments[0] || {};
var theBeers = Alloy.Collections.beers;
theBeers.fetch();

// Add beer look-up view to the screen ready to be used
var beerLookUpView = new lookUpView();
beerLookUpView.init();
$.nameBox.add(beerLookUpView.view);

// Add location look-up view to the screen ready to be used
var locationLookUpView = new lookUpView();
locationLookUpView.init();
$.locationBox.add(locationLookUpView.view);

// Initial place holder values
var theDate;                 // will hold moment.js date object
var theImage;                 // image returned from camreaMethods
var rating;                   // rating set by rating stars
var coords;                   // obj to store longitude/lattitude values  
var locSearchResults = null;
var beerSearchResults = null;
var ratingStarArray = [$.star1, $.star2, $.star3, $.star4, $.star5];

// Set hint text on text fields
$.name.hintText = L('add_name');
$.brewery.hintText = L('add_brewery');
$.percent.hintText = L('add_percent');
$.establishment.hintText = L('add_pub');
$.location.hintText = L('add_location');



/*
 * Additional set up depending on:
 * -------------------------------
 *  - If adding a new beer
 *  - editing an existing beer
 *  - adding a beer from search
 */

// Adding a new beer
if (!args.edit && !args.addingFromSearch) {
    theDate = moment(); // set as the current time/date
    applyRating(0);
    updateDateAndTimeLabels();
}

// Editing an exiting beer
if (args.edit) {
    var editBeer = theBeers.where({"alloy_id": args.alloy_id})[0];    
    applyRating(args.rating === null ? 0 : args.rating);
    var beerImage = Alloy.Globals.getImage(args);
    $.beerImage.image = beerImage;
    $.title.text = L("edit_title") || "";

    theDate = moment.utc(parseInt(args.date));
    
    updateDateAndTimeLabels();
    $.addBeerButton.title = "Save beer";

    $.dateAndTimeBox.show();
    $.dateAndTimeBox.setTop(25);
    $.dateAndTimeBox.setHeight(Ti.UI.SIZE);
}

// Adding a beer from search
if (args.addingFromSearch) {
    theDate = moment(); // set as the current time/date
    applyRating(0);
    $.beerImage.image = args.beer_image || args.brewery_image || null;      
}

// If editing or adding from search, populate the existing details
if (args.edit || args.addingFromSearch) {
    $.name.value = args.name || "";
    $.brewery.value = args.brewery || "";
    $.percent.value = args.percent || "";
    $.establishment.value = args.establishment || "";
    $.location.value = args.location || "";

    if (args.notes) $.notes.value = args.notes;   
    
    $.cameraImage.opacity = 0.7;
}





/**
 *  Add / Save Beer
 *  ---------------
 */
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
    var loadingView = Ti.UI.createView({ backgroundColor: "rgba(255,255,255,0.6)", opacity: 1, zIndex: 1000 });   
    $.addBeerWin.add(loadingView);
    //loadingView.animate({ opacity: 1, duration: 300 });
    
    
    // saving of the beer
    
    if (args.edit) {
        var updatedData = utils.mapLabelsToNewArgs($, args, rating, coords, theDate.valueOf());
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
        var beer = Alloy.createModel('beers', utils.mapLabelsToNewArgs($, args, rating, coords, theDate.valueOf()));
        beer.save();           
        theBeers.add(beer);
        
        if (args.addingFromSearch) {
            theImage = $.beerImage.toBlob();
        }
        
        if (theImage) {
            Alloy.Globals.saveImage(beer.get('alloy_id'), theImage);  
            theImage = null;
        }    
    }
    
    this.touchEnabled = true;
    
    if (theBeers.length > Alloy.CFG.num_beers_saved_before_review_prompt) {
    	setTimeout(function () { reviewPrompt.show(); }, 400);
    }
    
    $.addBeerWin.close();
    
});


/*
 * Updates the date and time labels according the theDate
 * object in the correct format.
 */
function updateDateAndTimeLabels() {
    $.date.text = theDate.format('DD MMM YYYY');
    $.time.text = theDate.format('HH:mm');
}



/*
 * Add photo
 * ---------
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



/*
 * Beer name look up
 * -----------------
 */
function doBeerLookUp(textField) {
    var searchTerm = textField.getValue();
    
    if (searchTerm.length === 0) { 
        beerLookUpView.closeUp(); 
        $.beerLookUpActivity.hide();
        return;
    }
    if (searchTerm.length >= 3) { 
        $.beerLookUpActivity.show(); 
    };
    
    if (searchTerm.length >= 3) {
        $.beerLookUpActivity.show();        
        data.lookUpBeer(searchTerm, function (results) {
            
            if (!results) {
                $.beerLookUpActivity.hide();
                return;
            }
            
            beerLookUpView.update(results);
            $.beerLookUpActivity.hide();
            
            beerLookUpView.table.addEventListener("click", function (e) {
                beerLookUpView.closeUp();
                setTimeout(function () {
                    $.name.value = e.rowData.name;
                    $.brewery.value = e.rowData.brewery || "";
                    $.percent.value = e.rowData.abv || "";
                    $.notes.value = e.rowData.notes || "";
                }, 100);
            });
        });
        
    } else {
        beerLookUpView.closeUp();
        $.beerLookUpActivity.hide();
    }   
}

var doBeerLookUp_debounced = _.debounce(doBeerLookUp, Alloy.CFG.api_call_debounce_delay);

$.name.addEventListener("focus", function (e) {
    //doBeerLookUp(this);
    setTimeout(function() { 
        $.scrollView.scrollTo(0, 200); 
    }, 300);
});

$.name.addEventListener("blur", function (e) {
   beerLookUpView.closeUp();  
});

$.name.addEventListener("change", function (e) {
    doBeerLookUp_debounced(this);    
});



/*
 * Location look up
 * ----------------
 */
$.location.addEventListener("focus", function (e) {
    setTimeout(function() { $.scrollView.scrollTo(0, 450); }, 300);
});
$.location.addEventListener("blur", function (e) {
    locationLookUpView.closeUp();    
});
function doLocationLookUp(e) {
    var searchTerm = e.value;
    
    if (searchTerm.length >= 3) { 
        $.locLookUpActivity.show(); 
    };

    if (searchTerm.length >= 3) { 
        $.locLookUpActivity.show();     
        data.lookUpAddress(searchTerm, function (results) {    
            if (!results) {
                $.locLookUpActivity.hide();
                return;
            }
            locationLookUpView.update(results);
            $.locLookUpActivity.hide();
            locationLookUpView.table.addEventListener("click", function (e) {
                locationLookUpView.closeUp();
                $.location.value = e.rowData.title;
                coords = e.rowData.coords;
            });
        });
    } else {
        locationLookUpView.closeUp(); 
        $.locLookUpActivity.hide();   
    }    
}

var doLocationLookUp_debounced = _.debounce(doLocationLookUp, Alloy.CFG.api_call_debounce_delay);

$.location.addEventListener("change", function (e) {
    //showHideLocationLabel();
    doLocationLookUp_debounced(e);   
});



/*
 * Use Location Button
 * -------------------
 * Function invoked when 'use location' button is pressed
 */
function useGPS() {
    
    locationLookUpView.closeUp();
    
    if (Ti.Geolocation.locationServicesEnabled) {
        $.location.touchEnabled = false;
        $.locLookUpActivity.show();
        
        Ti.Geolocation.purpose = 'Determine Current Location';
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
        Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;

        Titanium.Geolocation.getCurrentPosition(function(e) {           
            if (e.error) {
                $.location.touchEnabled = true; 
                $.locLookUpActivity.hide();
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
                        //$.locationLabel.hide();
                    } else {
                        alert(L("location_services_not_found"));
                    }
                    $.location.touchEnabled = true; $.locLookUpActivity.hide();
                });             
            }           
        });       
    } else {
        $.location.touchEnabled = true; 
        $.locLookUpActivity.hide();
        alert(L("location_services_disabled"));
    }
}



/*
 * Apply rating
 * ------------
 */

// Stores the rating (0-5) and applies it visually to the rating stars
function applyRating(number) {
    rating = number;
    for (var i = 0; i < number; i++) {
        ratingStarArray[i].color = Alloy.CFG.colour.main;
    }
    for (var i = number; i < 5; i++) {
        ratingStarArray[i].color = "#e6e6e5";
    }
}

// Click event listeners for the rating star images
for (var i = 0; i < 5; i++) {
   ratingStarArray[i].addEventListener("click", function () {
       applyRating(ratingStarArray.indexOf(this) + 1);
   }); 
};



/**
 *  Change Date
 *  -----------
 */
$.dateBox.addEventListener('click', function(e) {
    var picker = new datePicker();
    var pickerView = picker.getPicker({
        props: {
            type: Ti.UI.PICKER_TYPE_DATE,
            value: theDate.toDate()
        },
        onCancel: function () {
            picker.animateOut(function (e, thePicker) {
                $.scrollView.setTouchEnabled(true);
                $.addBeerWin.remove(pickerView);
                picker = null;
            });
        },
        onDone: function (e,thePicker) {
            var result = thePicker.getValue();
            theDate.date(result.getDate());
            theDate.month(result.getMonth());
            theDate.year(result.getFullYear());
            updateDateAndTimeLabels();
            picker.animateOut(function () {
                $.scrollView.setTouchEnabled(true);
                $.addBeerWin.remove(pickerView);
                picker = null;
            });
        }
    });
    $.scrollView.setTouchEnabled(false);
    $.addBeerWin.add(pickerView);
    picker.animateIn();
}); 



/*
 * Change Time
 * -----------
 */
$.timeBox.addEventListener('click', function(e) {
    var picker = new datePicker();
    var dateValue = moment.utc(theDate);
    var pickerView = picker.getPicker({
        props: {
            type: Ti.UI.PICKER_TYPE_TIME,
            value: dateValue.toDate()
        },
        onCancel: function () {
            picker.animateOut(function (e, thePicker) {
                $.scrollView.setTouchEnabled(true);
                $.addBeerWin.remove(pickerView);
                picker = null;
            });
        },
        onDone: function (e,thePicker) {
            var result = thePicker.getValue();
            theDate.hours(result.getHours());
            theDate.minutes(result.getMinutes());
            updateDateAndTimeLabels();
            picker.animateOut(function () {
                $.scrollView.setTouchEnabled(true);
                $.addBeerWin.remove(pickerView);
                picker = null;
            });
        }
    });
    $.scrollView.setTouchEnabled(false);
    $.addBeerWin.add(pickerView);
    picker.animateIn();
});



/*
 * Closing this window
 * -------------------
 */
$.addBeerWin.addEventListener("close", function() {
    $.destroy();
});

$.close.addEventListener("click", function () {
    $.addBeerWin.close();
});