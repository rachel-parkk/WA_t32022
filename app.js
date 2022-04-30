//set up the server
const express = require( "express" );
const app = express();
const port = 8080;
// define middleware that logs all incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
} );

// define a route for the default home page
app.get( "/", ( req, res ) => {
    res.sendFile( __dirname + "/views/index.html" );
} );

const read_stuff_all_sql = `
    SELECT
        id, item, quantity
    FROM
        item 

`
// define a route for the stuff inventory page
app.get( "/item", ( req, res ) => {
    db.execute(read_stuff_all_sql, (error, results)=>{
        if (error)
            res.status(500).send(error);
        else    res.send(results);

    })
    res.sendFile( __dirname + "/views/item.html" );
} );

const read_stuff_item_sql = `
    SELECT 
        id, item, quantity, description 
    FROM
        stuff
    WHERE
        id = ?
`

// define a route for the item detail page
app.get( "/item/notes/:id", ( req, res ) => {
    db.execute(read_stuff_all_sql, [req.params.id],  (error, results) => {
        req.params.id
        if (error)
            res.status(500).send(error); //Internal Server Error
        else
            res.send(results);
    });
});

// start the server
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );

