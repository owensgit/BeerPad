exports.definition = {
	config: {
        columns: {
            "name": "text",
            "brewery": "text",
            "style": "text",
            "rating": "integer",
            "percent": "integer",
            "establishment": "text",
            "location": "text",
            "notes": "text",
            "beer_image": "text", 
            "ibu": "integer", 
            "api_id": "text"
        },
		adapter: {
			type: "sql",
			collection_name: "searchResults"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};