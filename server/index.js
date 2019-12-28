// import express (after npm install express)
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

// server configuration
const PORT = 8080;

// create a route for the app
/*
app.get('^((?!(\/|about|error)).)*$', function(req, res) {
 res.redirect('/error');
});
*/

app.get('/', function (req, res) {
  res.render('home', {body: 'This is the body of the home page'})
})

app.get('/about', (req, res) => {
	// inject into FE
  res.render('about', { name: 'Timbo' })
})

// make another route. 
app.get('/error', function (req, res) {
  res.render('error', { problem: 'Error Page'})
})
// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});