var Alloy = require('alloy'), _ = require("alloy/underscore")._, Backbone = require("alloy/backbone");
var utils = require('utils');

var beerAPI = function() {};

beerAPI.prototype.lookUpBeer = function (query, callback) {
    
    var url = "http://api.brewerydb.com/v2/search/?key=" + Alloy.CFG.brewery_db_api_key + "&withBreweries=Y&type=beer&q=" + query;
    var repsonse = {};
    var _that = this;
    var client = Ti.Network.createHTTPClient({
         
        onload : function(e) {
            var responseJSON = JSON.parse(this.responseText);
            _that.results = responseJSON.data;
            if (callback) {
                callback(_that.results);
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
    
beerAPI.prototype.resultsTableData = function () {
    
    if (!this.results) {
        console.log("No beers found! Use the lookUpBeer method first.");
        return false;
    }    
    var rows = [];
    _.each(this.results, function (item) {
        var brewery;
        if (item.breweries) {
            brewery = item.breweries[0].name;
        }
        
        var row = Ti.UI.createTableViewRow({
            title: item.name,
            brewery: brewery || null,
            abv: item.abv || null,
            notes: item.description || null,
            api_id: item.id,
            font: { fontSize: "12dp" }
        });
        rows.push(row);
    });
    
    return utils.lookUpTableView(rows);
};


module.exports = beerAPI;