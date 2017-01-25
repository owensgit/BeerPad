exports.definition = {
	config: {
		columns: {
		    "name": "text",
		    "brewery": "text",
		    "rating": "integer",
		    "percent": "integer",
		    "establishment": "text",
		    "location": "text",
            "notes": "text",
            "date": "text",
            "date_string": "text",
            "beer_image": "text",
            "latitude": "integer",
            "longitude": "integer",
            "favourite": "boolean",
            "is_sample": "boolean",
            "api_id": "text"  
		},
		adapter: {
			type: "sql",
			collection_name: "beers"
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
			
			initialize: function () {
			     this.sortField = "date";
			     this.sortDirection = "DESC";
			},
			
			comparator: function (collection) {
                 var that = this;
                 return collection.get(that.sortField);
            },
            
            setSortField: function (field, direction) {
                this.sortField = field;
                this.sortDirection = direction;
            },
        
            sortBy: function (iterator, context) {
                var obj = this.models;
                var direction = this.sortDirection; 
                var self = this;
 
                return _.pluck(_.map(obj, function (value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iterator.call(context, value, index, list)
                    };
                }).sort(function (left, right) {
                    // swap a and b for reverse sort
                    var a = direction === "ASC" ? left.criteria : right.criteria;
                    var b = direction === "ASC" ? right.criteria : left.criteria;

                    // turn value into numbers if sorting the date UTC timestamp
                    if (self.sortField === "date") {
                        a = parseInt(a);
                        b = parseInt(b);
                    }
 
                    if (a !== b) {
                        if (a > b || a === void 0) return 1;
                        if (a < b || b === void 0) return -1;
                    }
                    return left.index < right.index ? -1 : 1;
                }), 'value');
            }
		});
		

		return Collection;
	}
};