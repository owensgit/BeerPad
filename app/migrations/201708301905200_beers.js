migration.up = function(migrator) {
	console.log('migrator 4 = up');
    migrator.db.execute('ALTER TABLE ' + migrator.table + ' ADD COLUMN style TEXT;');
};

migration.down = function(migrator) {
	console.log('migrator 4 = down');
    var db = migrator.db;
    var table = migrator.table;
    db.execute('CREATE TEMPORARY TABLE beers_backup(alloy_id,name,brewery,rating,percent,establishment,location,notes,date,date_string,beer_image,latitude,longitude,favourite,is_sample,ibu,api_id);');
    db.execute('INSERT INTO beers_backup SELECT alloy_id,name,brewery,rating,percent,establishment,location,notes,date,date_string,beer_image,latitude,longitude,favourite,is_sample,ibu,api_id FROM ' + table + ';');
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
            "is_sample": "boolean",
            "ibu": "integer",
            "api_id": "text"
        },
    });
    db.execute('INSERT INTO ' + table + ' SELECT alloy_id,name,brewery,rating,percent,establishment,location,notes,date,date_string,beer_image,latitude,longitude,favourite,is_sample,ibu,api_id FROM beers_backup;');
    db.execute('DROP TABLE beers_backup;');
};
