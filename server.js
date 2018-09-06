// Require "express" package for creating and running the web server with Node
const express = require('express');

// Require "body-parser" package to be able to access the key-value pairs stored on the "req-body" object
// :: Express is a minimalist framework. However, we can make use of Middleware (functions that have access to the req and res bodies)
// :: in order to preform more advanced tasks
const bodyParser = require('body-parser');

// Require "request" package for making http request in Node
const request = require('request');

const openWeatherMapKey = '*****************************';

// Create instance named app by invoking Express
// :: app.use - mount middleware
// :: app.set - application settings
// :: app.get - routes HTTP GET request to the specified path with the specified callback function
// :: app.post - same as app.get but with HTTP POST request
// :: app.listen - binds and listens for connections on the specified host and port
const app = express();

// Exposing the public folder to allow access of all static files within the "public" folder from browser
// :: express.static is a built-in middleware function in Express, use for serving static files
// :: Express looks up the files relative to the static directory, so the name of the "static" directory is not part of the URL
// :: [eg] http://localhost:3000/css/style.css
// :: If preferred to use a vitual path (does not actually exist in the file system), specify a mount path for the static directory
// :: [eg] app.use('/static', express.static(path.join(__dirname, 'public'))) => http://localhost:3000/static/css/style.css
app.use(express.static('public'));
// Setting the middleware to only parse urlencoded bodies
// extended: true => allowing JSON-like experience
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as the template engine
// By default EJS is accessed in the views folder
app.set('view engine', 'ejs');

// Simple helper for rendering the view
const renderView = (res, weather = null, error = null) => {
  // Rendering index with a second argument
  // :: res.render has an optional second argument - an object for specifying properties to be handled by views
  res.render('index', {
    weather,
    error
  });
};

// Specifically focusing on the root URL (/)
app.get('/', (req, res) => {
  renderView(res);
});

// Setting up POST Route for handling the form action which is submitting a post request to the route "/"
app.post('/', (req, res) => {
  // Grabbing the city off of req.body
  const city = req.body.city;
  // Creating the url string to access the OpenWeatherMap API
  const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${openWeatherMapKey}`;

  // Making the API call
  request(url, (err, response, body) => {
    // First checking for an error
    if (err) {
      renderView(res, null, 'Error, please try again');

      return;
    }

    // Parsing the body into a usable JavaScript object
    const { main, name } = JSON.parse(body);

    // Checking if user input a string that isn't a city
    if (main === undefined) {
      // In this instance, render the index view and also pass back an error
      renderView(res, null, 'Error, please try again');
    } else {
      // Creating a string that clarifies what the weather is
      const weatherText = `It's ${main.temp} degrees in ${name}!`;

      // Sending "weatherText" back with the index view
      renderView(res, weatherText);
    }
  });
});

// Creating a server that listens on port 3000 for connections
app.listen(3000, function() {
  console.log(
    '\n🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥\nApp listening on port 3000!\n🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥 🔥\n'
  );
});
