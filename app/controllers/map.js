var utils = require("utils");

var args = arguments[0] || {};

var theBeers = Alloy.Collections.beers;

if (OS_IOS) {

    var Map = require('ti.map');
    
    var longitudes = [];
    var latitudes = [];
    
    // latitude min   -90 max 90
    // longitude min -180 max 180
    
    function addPins(collection) { ;   
        longitudes = [];
        latitudes = [];  
        _.each(collection.toJSON(), function (item) { 
                 
            if (item.latitude && item.longitude) {  
                longitudes.push(item.longitude);
                latitudes.push(item.latitude);
                
                var image = Alloy.Globals.getImage(item);
    
                var buttonView = Ti.UI.createView({ height: "40dp", width: "40dp" });
                
                var annotation = Map.createAnnotation({
                    latitude: item.latitude,
                    longitude: item.longitude,
                    title: item.name,
                    subtitle: item.brewery,
                    pincolor: Map.ANNOTATION_ORANGE,
                    rightButton: "mapInfoButton.png",
                    beerId: item.alloy_id // Custom property to uniquely identify this annotation.                   
                });
                
                if (image) {
                    var theImage = Ti.UI.createImageView({
                        image: Alloy.Globals.getImage(item),
                        height: "40dp", width: "40dp"
                    }); 
                    annotation.leftView = theImage;
                }
                
                mapview.addAnnotation(annotation);   
            }
        });
        
        setTimeout(function () {  setMarkersWithCenter(mapview, latitudes, longitudes); }, 300);
    }
    
    function setMarkersWithCenter(map,latiarray,longiarray) {
        if (latiarray.length != longiarray.length) { return; }            
        var total_locations = latiarray.length;
        var minLongi = null, minLati = null, maxLongi = null, maxLati = null;
        var totalLongi = 0.0, totalLati = 0.0;   
        for(var i = 0; i < total_locations; i++) {
            if(minLati == null || minLati > latiarray[i]) {
                minLati = latiarray[i];
            }
            if(minLongi == null || minLongi > longiarray[i]) {
                minLongi = longiarray[i];
            }
            if(maxLati == null || maxLati < latiarray[i]) {
                maxLati = latiarray[i];
            }
            if(maxLongi == null || maxLongi < longiarray[i]) {
                maxLongi = longiarray[i];
            }
        }    
        var ltDiff = maxLati-minLati;
        var lgDiff = maxLongi-minLongi;
        var delta = ltDiff>lgDiff ? ltDiff : lgDiff;
        delta = delta * 2 > 180 ? 180 : delta * 2;      
        if (total_locations>0 && delta>0) {
            map.setLocation({
                animate : true,
                latitude:((maxLati+minLati)/2),
                longitude:((maxLongi+minLongi)/2),
                latitudeDelta:delta,
                longitudeDelta:delta,
            }); 
        }
    }
    
    mapview = null;
    
    Alloy.Globals.createmap = function() {
        mapview = Map.createView({
            mapType:Map.NORMAL_TYPE,
            userLocation: false
        });
        mapview.addEventListener('click', function(e) {
            if (e.clicksource === "rightButton") {
                utils.goToBeer(e.annotation.beerId);    
            }
        });
        theBeers.fetch();
        addPins(theBeers);     
        $.mapContainer.add(mapview);   
    };
    
    Alloy.Globals.createmap();
    
    Ti.App.addEventListener("updatemap", function () {
        mapview.removeAllAnnotations();
        theBeers.fetch();
        addPins(theBeers);
    });
    
    theBeers.on("change add remove", function (e) {
        Alloy.Globals.waitForFinalEvent(function () {   
            Ti.App.fireEvent("updatemap");  
        }, 300, "Update the map");
    });
    
    var addButton = Ti.UI.createButton({ systemButton: Ti.UI.iPhone.SystemButton.ADD });
    $.map.setRightNavButton(addButton);
    
    addButton.addEventListener("click", function () {
        var window = Alloy.createController('addBeer').getView();
            window.open({
                modal:true,
                modalTransitionStyle: Ti.UI.iPhone.MODAL_TRANSITION_STYLE_COVER_VERTICAL,
                modalStyle: Ti.UI.iPhone.MODAL_PRESENTATION_FORMSHEET
        });
    });

} // end if OS_IOS