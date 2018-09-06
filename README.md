# Simple Web Weather App with Node.js

## Dependencies

- [OpenWeatherMap.org](https://home.openweathermap.org/api_keys)
- **Node.js**

## Framework & NPM Modules Used

- [express](https://expressjs.com/) - to create and run a web server with Node
- [ejs (Embedded JavaScript)](http://www.embeddedjs.com/) - to dynamically create HTML based on variables
- [body-parser](https://expressjs.com/) - to allow making use of the key-value pair stored on the `req-body`
- [request](https://www.npmjs.com/package/request) - to make an http request in Node

## App Setup

- Create an empty directory (eg: `weather-app`).
- Open console, navigate to the directory and run `npm init`.
- Fill out required information to initialise the app.
- Create a file (eg: `server.js`) within the directory, this will house the code for server-side code.

---

## Code Walkthrough

### Server Setup

- Create the web server with **ExpressJS**. Install in the console with:

```
npm install --save express
```

- Go copy the biolerplate Express starter app from their [Express documentation](https://expressjs.com/en/starter/hello-world.html):

```
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));
```

This will start a server and listens on port 3000 for connections.

- Running `node server.js` from the console will give:

```
Example app listening on port 3000!
```

While accessing `localhost:3000` from the browser, you should see a plain _Hello World!_ text.

### HTML/View Setup

- To change the _Hello World!_ text with an HTML page, **EJS** can help achieve this. Install it with:

```
npm install ejs --save
```

- Setup the template engine with below code by placing it after **require** statement:

```
app.set('view engine', 'ejs')
```

- EJS is accessed by default in the `views` directory. So create the folder and add a file named `index.ejs`. Think of `index.ejs` file as an HTML file for now. The file structure so far should looks like:

```
|-- weather-app
   |-- views
      |-- index.ejs
   |-- package.json
   |-- server.js
```

- Here's a boilerplate for `index.ejs` file. It's just a form with one input for city and one submit button:

```
<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <title>Simple Web Weather App with Nodejs</title>
  <link rel="stylesheet" type="text/css" href="/css/style.css">
  <link href="https://fonts.googleapis.com/css?family=Pacifico" rel="stylesheet">
  <link href='https://fonts.googleapis.com/css?family=Open+Sans:300' rel='stylesheet' type='text/css'>
</head>

<body>
  <form action="/" method="post">
    <input name="city" type="text" class="app-input" placeholder="Enter a city" required>
    <button type="submit" class="app-button">++ Get Weather ++</button>
  </form>
</body>

</html>
```

- Replacing `app.get` code to send the `index.ejs` file instead:

```
app.get('/', (req, res) => {
  // OLD CODE
  res.send('Hello World!');

  // NEW CODE
  res.render('index');
})
```

- Running `node server.js` again you should now see a plain and boring form on the browser.

### Adding Static Files

- Create a new folder `public` within the App directory, then a `css` folder within it, and finally create the file for CSS (eg: `style.css`). The new file structure looks like:

```
|-- weather-app
   |-- views
      |-- index.ejs
   |-- public
      |-- css
         |-- style.css
   |-- package.json
   |-- server.js
```

- Exposing the static files within the `public` folder, as _Express_ wont allow access to it by default:

```
const express = require('express');
app.use(express.static('public'));
...
```

- Once the CSS file is set the form should now become prettier. You can grab the sample CSS code in the repo.

### Handling POST Route

- Since form is submitting a **post** request to the `/` route, a **post** route should be defined as well, which looks just like a get request:

```
app.post('/', function (req, res) {
  res.render('index');
})
```

- To be able to access the user's input (in this case the name of "city") from server-side, `body-parser` can be used to read it from the `req-body` object. Go ahead and install with:

```
npm install body-parser --save
```

- Requiring and making use of the _middleware_ in `server.js` file:

```
const bodyParser = require('body-parser');
// ...
// ...
app.use(bodyParser.urlencoded({ extended: true }));
```

- Once the _middleware_ is set the `req.body` object becomes available containing the request parameters. Updating the **post** definition with the below code should also log the value of "city" to the console.

```
app.post('/', function (req, res) {
  res.render('index');

  // Logging city value
  console.log(req.body.city);
})
```

### Incorporating Actual API with OpenWeatherMap

- Updating the **post** definition again, this time, adding the call for OpenWeatherMap API. Here's the complete code for it:

```
app.post('/', (req, res) => {
  let city = req.body.city;

  // Setting up the API URL
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${openWeatherMapKey}`;

  // Making the API call
  request(url, (err, response, body) => {
    // Checking for error
    if (err) {
      res.render('index', {
        weather: null,
        error: 'Error, please try again'
      });

      return;
    }

    // Displaying the weather
    let weather = JSON.parse(body);
    if (weather.main == undefined) {
      res.render('index', {
        weather: null,
        error: 'Error, please try again'
      });

    } else {
      let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
      res.render('index', {
        weather: weatherText,
        error: null
      });
    }
  });
});
```

The code can be optimised a little bit but leaving it like this for easier reading.

### Handling Variables in View with EJS

- Based on the above code, the `res.render` method is passing 2 variables into the view:

```
{
  weather: <String>,
  error: <String>
}
```

- View on the other hand should receive and work on these variables. Here's the code for **EJS** that needs adding into the view file `index.ejs`

```
<% if (weather !== null) { %>
  <p><%= weather %></p>
<% } %>
<% if (error !== null) { %>
  <p><%= error %></p>
<% } %>
```

Main thing to remember about **EJS** is that it stands for _Embedded JavaScript_ hence the condition inside `<% CODE HERE %>` except when an equal sign is included `<%= CODE HERE ADDS HTML %>` the code will add HTML to the result.

---

Final codes are included in the repo.

~ Happy Coding 😊
