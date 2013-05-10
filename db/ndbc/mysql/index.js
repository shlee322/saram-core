module.exports = function(obj) {
    this.table = table;
}

function table(name, columns, options, next) {
    var query = 'CREATE TABLE ';
    query += '`' + name + '`';
    query += ' ( ';

    for(var column in columns) {
        var data = columns[column];
        query += '`' + column + '` ';
        if(data.type == "int") {
            query += "INT(10) not null,";
        } else if(data.type == "string") {
            query += "CHAR(64) not null,";
        }
    }

    for(var i in options.indexes) {
        var index = options.indexes[i];
        if(index.type == 'index') {
            query += 'INDEX ';
        }  else if(index.type == 'unique') {
            query += 'UNIQUE INDEX ';
        } else if(index.type == 'primary') {
            query += 'PRIMARY KEY (`' + index.columns[0].name + '`), ';
            continue;
        } else {
            continue;
        }

        query += '`' + index.name + '` (';

        for(var c in index.columns) {
            query += '`' + index.columns[c].name + '`';
            if(index.columns[c].order == 'desc') {
                query += ' DESC';
            } else {
                query += ' ASC';
            }
            query += ', ';
        }
        query = query.substring(0, query.length - 2);
        query += '), '
    }
    query = query.substring(0, query.length - 2);
    query += ');';

    next();
}

