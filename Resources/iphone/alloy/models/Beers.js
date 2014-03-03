exports.definition = {
    config: {
        columns: {
            name: "text",
            brewery: "text",
            rating: "integer",
            establishment: "text",
            location: "text",
            notes: "text"
        },
        adapter: {
            type: "sql",
            collection_name: "beers"
        }
    },
    extendModel: function(Model) {
        _.extend(Model.prototype, {});
        return Model;
    },
    extendCollection: function(Collection) {
        _.extend(Collection.prototype, {});
        return Collection;
    }
};

var Alloy = require("alloy"), _ = require("alloy/underscore")._, model, collection;

model = Alloy.M("beers", exports.definition, []);

collection = Alloy.C("beers", exports.definition, model);

exports.Model = model;

exports.Collection = collection;