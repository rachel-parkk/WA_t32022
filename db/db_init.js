// (Re)Sets up the database, including a little bit of sample data
const db = require("./db_connections");

/**** Delete existing table, if any ****/

const drop_stuff_table_sql = "DROP TABLE IF EXISTS stuff;"

db.execute(drop_stuff_table_sql);

/**** Create "stuff" table (again)  ****/

const create_stuff_table_sql = `
    CREATE TABLE stuff (
        id INT NOT NULL AUTO_INCREMENT,
        homework VARCHAR(45) NOT NULL,
        due_date VARCHAR(150) NOT NULL,
        description VARCHAR(150) NULL,
        PRIMARY KEY (id)
    );
`
db.execute(create_stuff_table_sql);


const insert_stuff_table_sql = `
    INSERT INTO stuff 
        (homework, due_date, description) 
    VALUES 
        (?, ?, ?);
`
db.execute(insert_stuff_table_sql, ['Chem Webassign', '5/20/2022', 'im rly bad at chem :(']);

db.execute(insert_stuff_table_sql, ['English project', '6/2/2022', null]);

db.execute(insert_stuff_table_sql, ['history DBQ', '6/10/2022', 'i dont know what its on tbh !!']);

db.execute(insert_stuff_table_sql, ['math hw', '1/20/2022', 'late homework assignment!!']);

const read_stuff_table_sql = "SELECT * FROM stuff";

db.execute(read_stuff_table_sql, 
    (error, results) => {
        if (error) 
            throw error;

        console.log("Table 'stuff' initialized with:")
        console.log(results);
    }
);

db.end();