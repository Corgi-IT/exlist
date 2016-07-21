# Exlist
Indexes all Express routes declared, makes it possible to print it in a nice table (CLI) and makes it possible to generate urls in views

## Requirements

- Node.js 6.x
- Expressjs

Also works with EJS

## Usage
 
CLI
   
```
npm install --save exlist
```

APP  

```
const app = require('express')();
const exlist = require('exlist');

app.use(exlist(app));

// Exlist takes an object as the first argument with properties url and handle.
app.get({url: '/', handle: 'home'}, (req, res) => {
    res.render('index');
});

// Instead of res.redirect, res.exlist can be called to redirect to a page as listed in exlist
app.get({url: '/contact', handle: 'contact'}, (req, res) => {
    res.exlist('/about');
});

// Exlist also takes a String as first argument. This makes the url the same as the handle.
app.get('/about', (req, res) => {
    // Just want to get the url to something?, no problem!
    const user_page_url = res.exlist.route('contact');
    res.render('about', {user_page_url});
});

// URL Parameters can be added like normal
app.get({url: '/user/:id', handle: 'show-user'}, fn);

// If you'd like a CLI table for development purposes
exlist.cliTable();
```

EJS

``` HTML
<!-- res.exlist is the same function as function 'route' added to ejs -->
<a href="<%= route('contact') %>">Contact</a>

<!-- If any parameters are added in an Express url,
you can have them converted by adding a second argument to the call whose properties
should be the same as the parameters in the Express url -->
<a href="<%= route('show-user', {id: 1}) %>">To user 1</a>

<!-- It's also possible to ask Exlist what the parameters for a route is, getRoute will return the parameters as an array -->
User route parameters: <%= JSON.stringify(getRoute('show-user').getParams(), null, 4); %>

```


