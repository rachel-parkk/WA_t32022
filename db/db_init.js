const db = require("./db_connection");

//delete the table if it already exists
const drop_stuff_stable_sql = "DATA TABLE IF EXISTS item"; 

db.execute(drop_item_table_sql); 

//create the table with suitable columns and such
//add some simple data to the table

const insert_item_table_sql = `
    INSERT INTO stuff
        (item, quantity, description)
    VALUES 
        (?,?,?)
`
db.execute(insert_item_table_sql,["widget","5","widgets are cool1"])
db.execute(insert_item_table_sql,["widget","100",null])


db.end();