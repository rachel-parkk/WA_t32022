const express = require( "express" );
const logger = require("morgan");
const db = require('./db/db_connections');
const app = express();

const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;


app.set( "views",  __dirname + "/views");
app.set( "view engine", "ejs" );
// start the server


// define middleware that logs all incoming requests
app.use(logger("dev"));

// define middleware that serves static resources in the public directory
app.use(express.static(__dirname + '/public'));

app.use( express.urlencoded({ extended: false }) );

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
const read_homework_sql = `
    SELECT 
        id, homework, due_date, description
    FROM
        stuff
    WHERE
        id = ?
`
app.get( "/stuff/homework/:id", ( req, res ) => {
    db.execute(read_homework_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else if (results.length == 0)
            res.status(404).send(`No item found with id = "${req.params.id}"` ); // NOT FOUND
        else {
            let data = results[0]; // results is still an array
            // data's object structure: 
            //res.render('homeworkhttp://localhost:8080', data);
            res.render('homework', data);
        }
    });
});

// define a route for item DELETE
const delete_homework_sql = `
    DELETE 
    FROM
        stuff
    WHERE
        id = ?
`
app.get("/stuff/homework/:id/delete", ( req, res ) => {
    db.execute(delete_homework_sql, [req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect("/stuff");
        }
    });
})

// define a route for item UPDATE
const update_homework_sql = `
    UPDATE
        stuff
    SET
        homework = ?,
        due_date = ?,
        description = ?
    WHERE
        id = ?
`
app.post("/stuff/homework/:id", ( req, res ) => {
    db.execute(update_homework_sql, [req.body.homework, req.body.due_date, req.body.description, req.params.id], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            res.redirect(`/stuff/homework/${req.params.id}`);
        }
    });
})
// define a route for item Create
const create_homework_sql = `
    INSERT INTO stuff
        (homework, due_date)
    VALUES
        (?, ?)
`
app.post("/stuff", ( req, res ) => {
    db.execute(create_homework_sql, [req.body.homework, req.body.due_date], (error, results) => {
        if (error)
            res.status(500).send(error); //Internal Server Error
        else {
            //results.insertId has the primary key (id) of the newly inserted element.
            res.redirect(`/stuff/homework/${results.insertId}`);
        }
    });
})
app.listen( port, () => {
    console.log(`App server listening on ${ port }. (Go to http://localhost:${ port })` );
} );