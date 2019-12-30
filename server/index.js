// index js creates app and sets up routing services. 
const express = require('express')

// create new express app and save it as "app"
const app = express()

//this required before view engine setup

// assert that we're using hbs. 
app.set('view engine', 'hbs')

const hbs = require('hbs')

hbs.registerPartials('public/views/partials')

// view engine setup
app.set('views', 'public/views/layout')

// sets base url for use in .hbs files. 

app.set("view options", {
    baseURLEXT: "/public/views/layouts"
})

// set location of views directory - public/views.
app.use(express.static('public'))

// server configuration
const PORT = 8080;

// bodyParser for POSTs
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(bodyParser.json())

// create a route for the app
/*
app.get('^((?!(\/|about|error)).)*$', function(req, res) {
 res.redirect('/error');
});
*/

// database setup. 

const MongoClient = require('mongodb').MongoClient

var db

// creds. grab from enviroment var file.
require('dotenv').config({path:'.env'})
var url = process.env.MONGO_URI

MongoClient.connect(url,  { useUnifiedTopology: true }, (err, client) => {
    if (err) return console.log(err)
    db = client.db('fun-words') // whatever your database name is
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}/`);
    })
})

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/about', (req, res) => {
    // example of how to inject content into FE
    res.render('about', {
        name: 'Timothy Schott'
    })
})

// make another route. 
app.get('/error', (req, res) => {
    res.render('error', {
        problem: 'Error Page'
    })
})

// add quotes. 
app.get('/submit', (req, res) => {
    res.render('submit')
})

// handler for that request.
// takes the input of the form and puts it in the database. 
app.post('/quotes', (req, res) => {
    var d = new Date().toString()
    var obj = req.body;
    obj.date = d;
    db.collection('words').insertOne(obj, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
        res.redirect('/')
    })
})


// display words
app.get('/words', (req, res) => {
        db.collection('words', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log(items)

            res.render('words', {
                words: items
            })
        })
    })
})















