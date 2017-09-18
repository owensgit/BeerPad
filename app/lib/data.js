var data = (function () {
    var methods = {};
    
    methods.lookUpBeer = function (query, callback) {
    
        var url = "http://api.brewerydb.com/v2/search/?key=" + Alloy.CFG.brewery_db_api_key + "&withBreweries=Y&type=beer&q=" + query;
        var repsonse = {};
        var _that = this;

        // Example search:
        // http://api.brewerydb.com/v2/search/?key=aa4423f8887ce03f2d18d94d75bc36b6&withBreweries=Y&type=beer&q=Sun
        //console.log('Search URL: ', url);

        var client = Ti.Network.createHTTPClient({
             
            onload : function(e) {
                var responseJSON = JSON.parse(this.responseText);
                _that.results = responseJSON.data;
                
                var results = [];

                //console.log('responseJSON.data', responseJSON.data);
    
                _.each(responseJSON.data, function (item) {
                    var result = {}, brewery;
                    
                    if (item.breweries) {
                        brewery = item.breweries[0].name;
                        
                        if (item.breweries[0].images) {
                            result.brewery_image = item.breweries[0].images.large || item.breweries[0].images.medium || null;    
                        }   
                    }
                    
                    result.title = item.name;
                    result.name = item.name;
                    result.brewery = brewery || null;
                    result.abv = item.abv || null;
                    result.notes = item.description || null;
                    result.ibu = item.ibu || null;
                    result.api_id = item.id;
                    result.style = item.style && item.style.shortName || null;
                    
                    if (item.labels) {
                        result.beer_image = item.labels.large || item.labels.medium || item.labels.small || null;
                    }
                    
                    if (item.breweries) {
                        result.title = item.name + " - " + brewery;      
                    }
                    
                    results.push(result);
                });
                         
                if (callback) {
                    callback(results);
                }
            },
             
            onerror : function(e) {
                _that.results = null;
                if (callback) {
                    callback(_that.results);
                }
                Ti.API.debug(e.error);
            },
            timeout : 5000  // in milliseconds
        });
        client.open("GET", url); 
        client.send();
        return query;
    };
    
    methods.lookUpAddress = function (query, callback) {
    
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&key=" + Alloy.CFG.forward_geocoding_api_key;
        var repsonse = {};
        var _that = this;
        var client = Ti.Network.createHTTPClient({
             
            onload : function(e) {
                var responseJSON = JSON.parse(this.responseText);
                
                var results = [];
    
                _.each(responseJSON.results, function (item) {
                    var result = {
                        title: item.formatted_address,
                        location: item.formatted_address,
                        coords: { latitude: item.geometry.location.lat, longitude: item.geometry.location.lng }
                    };
                    results.push(result);
                });
       
                if (callback) {
                    callback(results);
                }
            },
             
            onerror : function(e) {
                _that.results = null;
                if (callback) {
                    callback(_that.results);
                }
                Ti.API.debug(e.error);
            },
            timeout : 5000  // in milliseconds
        });
        client.open("GET", url); 
        client.send();
        return query;
    };
    
    return methods;     
})();

module.exports = data;


