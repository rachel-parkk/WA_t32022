//set up the server
const express = require( "express" );
const logger = require("morgan");
const db = require('./db/db_connection');
const app = express();
const port = 8080;

// Configure Express to use EJS
app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );
// // Configure Express to parse incoming JSON data
// app.use( express.json() );
// Configure Express to parse URL-encoded POST request bodies (traditional forms)
app.use( express.urlencoded({ extended: false }) );

// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.render('index');
} );

// define a route for the stuff inventory page
const read_notes_all_sql = `
    SELECT 
        id, item, quantity
    FROM
        notes
`
app.get( "/notes", ( req, res ) => {
    db.execute(read_notes_all_sql, (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.render('notes', { inventory : results });
        }
    });
} );

// define a route for the item detail page
const read_notes_item_sql = `
    SELECT 
        id, item, quantity, description 
    FROM
        notes
    WHERE
        id = ?
`
app.get( "/notes/item/:id", ( req, res ) => {
    db.execute(read_notes_item_sql, [req.params.id], (error, results) => {
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

// define a route for item DELETE
const delete_item_sql = `
    DELETE 
    FROM
        notes
    WHERE
        id = ?
`
app.get("/notes/item/:id/delete", ( req, res ) => {
    db.execute(delete_item_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/notes");
        }
    });
})

// define a route for item UPDATE
const update_item_sql = `
    UPDATE
        notes
    SET
        item = ?,
        quantity = ?,
        description = ?
    WHERE
        id = ?
`
app.post("/notes/item/:id", ( req, res ) => {
    db.execute(update_item_sql, [req.body.name, req.body.quantity, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/notes/item/${req.params.id}`);
        }
    });
})

// define a route for item CREATE
const create_item_sql = `
    INSERT INTO notes
        (item, quantity)
    VALUES
        (?, ?)
`
app.post("/notes", ( req, res ) => {
    db.execute(create_item_sql, [req.body.name, req.body.quantity], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/notes/item/${results.insertId}`);
        }
    });
})

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );