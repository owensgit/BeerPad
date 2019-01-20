migration.up = function(migrator) {
    migrator.createTable({
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
            "favourite": "boolean"
        },
        adapter: {
            type: "sql",
            collection_name: "beers"
        }
    });
};

migration.down = function(migrator) {
    migrator.dropTable("beers");
};

