const express = require( "express" );
const logger = require("morgan");
const db = require('./db/db_connections');
const app = express();
const port = 8080;


app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );
// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

// define a route for the stuff inventory page
// define a route for the stuff inventory page
const read_stuff_all_sql = `
    SELECT 
        id, homework, due_date, description
    FROM
        stuff
`
app.get( "/stuff", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.render('stuff', { inventory : results });
        }
    });
} );
// define a route for the item detail page
const read_item_sql = `
    SELECT 
        id, homework, due_date, description
    FROM
        stuff
    WHERE
        id = ?
`
app.get( "/stuff/item/:id", ( req, res ) => {
    db.execute(read_homework_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            // data's object structure: 
            //  { item: ___ , quantity:___ , description: ____ }
            res.render('item', data);
        }
    });
});