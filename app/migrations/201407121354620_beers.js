migration.up = function(migrator) {
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN ibu INTEGER;');
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN api_id TEXT;');
};

migration.down = function(migrator) {
    var db = migrator.db;
    var table = migrator.table;
    db.execute('CREATE TEMPORARY TABLE beers_backup(alloy_id,name,brewery,rating,percent,establishment,location,notes,date,date_string,beer_image,latitude,longitude,favourite,is_sample);');
    db.execute('INSERT INTO beers_backup SELECT alloy_id,name,brewery,rating,percent,establishment,location,notes,date,date_string,beer_image,latitude,longitude,favourite,is_sample FROM ' + table + ';');
    migrator.dropTable();
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
            "favourite": "boolean",
            "is_sample": "boolean"
        },
    });
    db.execute('INSERT INTO ' + table + ' SELECT alloy_id,name,brewery,rating,percent,establishment,location,notes,date,date_string,beer_image,latitude,longitude,favourite,is_sample FROM beers_backup;');
    db.execute('DROP TABLE beers_backup;');
};
