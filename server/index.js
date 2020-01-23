// index js creates app and sets up routing services. 
const express = require('express')

var jsdom = require("jsdom");
// create new express app and save it as "app"
const app = express()

//this is required before view engine setup
// assert that we're using hbs. 
app.set('view engine', 'hbs')

// use express-hbs so we can use handlebars helpers. 
var hbs = require('express-hbs')

// sets partials directory. 
app.engine('hbs', hbs.express4({

    partialsDir: 'public/views/partials'
}))

// view engine setup
app.set('views', 'public/views/layout')

// sets base url for use in .hbs files. 
app.set("view options", {

    baseURLEXT: "/public/views/layouts"
})

// set location of views directory - public/views.
app.use(express.static('public'))

// server configuration
const PORT = process.env.PORT || 8080

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
require('dotenv').config({

    path: '.env'
})
var url = process.env.MONGO_URI

// connect to database.
MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {

    if (err) return console.log(err)
    db = client.db('fun-words') // the database to this, try
    app.listen(PORT, () => {
        console.log(`Server running at: http://localhost:${PORT}/`);
    })
})

app.get('/', (req, res) => {

    db.collection('words', function (err, collection) {

        // a few different cascading functions that count and sort the database to serve the views.
        collection.countDocuments({}, function(err, word_count) {
        
            collection.distinct("book", function(err, books) {

                var book_count = books.length

                    res.render('home', {

                        word_total: word_count,
                        book_total: book_count

                    })
            })
        })
    })
})

app.get('/about', (req, res) => {
    // inject content into FE

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

// hidden submit endpoint. 
app.get('/submit', (req, res) => {

    res.render('submit')
})

// allows us to inject dynamic handlebars. hand off an dynamic id and word label
hbs.registerHelper('getKey', function (word, options) {

    var out = ""

    out = '<a class="list-group-item list-group-item-action" data-toggle="list" href="#' + word.toLowerCase() + '" ' + 'role="tab">' + word + '</a>'
    
    return out
})

// display the description of the word. 
hbs.registerHelper('getDescription', function (book, author, word, sentence, definition, options) {

    var regex = new RegExp('\\b' + word + '\\b');
    var match = regex.exec(sentence)
    var start = match.index
    var end = match.index + match[0].length

    var highlighted = sentence.substring(0, start) 
    + '<span style= "background-color: #69dcd6">' 
    + sentence.substring(start, end) + '</span>' + sentence.substring(end)

    var tmp = ""

    tmp = '<div class="tab-pane" id ="' + word.toLowerCase() + '" ' + 'role="tabpanel">' +
        '<p> The word\'s definition is: </p><p> ' + '<em>' + definition + '</em> ' + '</p>' +
        '<p> It is used in the book ' + '<span class = "special-name">' + book + '</span> by <span class="special-name">' + author + '</span> as follows: </p>' +
        '<p> ' + highlighted +
        '</p></div>'

    return tmp
})

// takes the input of the submit form and puts it in the database. 
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

// display dictionary. 
app.get('/words', (req, res) => {

    // set our collection as words
    db.collection('words', function (err, collection) {

        // a few different cascading functions that count and sort the database to serve the views.
        collection.countDocuments({}, function(err, word_count) {
        
            collection.distinct("book", function(err, books) {

                var book_count = books.length

                // case insensitive sort. 
                collection.find({}).collation({'locale':'en'}).sort({'word':1}).toArray(function (err, items) {

                    res.render('words', {

                        words: items,
                        word_total: word_count,
                        book_total: book_count

                    })
                })
            })
        })
    })
})