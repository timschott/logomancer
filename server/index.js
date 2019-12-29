// index js creates app and sets up routing services. 
const express = require('express');

// create new express app and save it as "app"
const app = express();

// use hbs for front end
const hbs = require('hbs')

//this required before view engine setup
hbs.registerPartials('public/views/partials');

// view engine setup
app.set('views', 'public/views/layout');

app.set('view engine', 'hbs');

// set location of views directory - public/views.

app.use(express.static('public'))

// sets base url for use in .hbs files. 

app.set("view options" , {baseURLEXT: "/public/views/layouts"});
// server configuration
const PORT = 8080;

// bodyParser for POSTs
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// create a route for the app
/*
app.get('^((?!(\/|about|error)).)*$', function(req, res) {
 res.redirect('/error');
});
*/

app.get('/', (req, res) => {
  res.render('home', {body: 'This is the body of the home page'})
})

app.get('/about', (req, res) => {
  // example of how to inject content into FE
  res.render('about', { name: 'Timbo' })
})

// make another route. 
app.get('/error', (req, res) => {
  res.render('error', { problem: 'Error Page'})
})

// add quotes. 
app.get('/submit', (req, res) => {
  res.render('submit')
})

// handler for that request.
app.post('/quotes', (req, res) => {
  console.log(req.body)
})

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});