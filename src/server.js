"use strict";

const express = require ('express');
const path = require ('path');
const bodyParser = require ('body-parser');

const app = new express ();

app.set ('view engine', 'ejs');
app.set ('views', path.join (__dirname, 'src/views'));
app.use (express.static ('dist'));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({ extended: true }));

app.get ('*', (req, res) => res.render ('index', {
  reactOutput: '<h1>TODO</h1>'
}));
