import Express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOMServer from 'react-dom/server'
import App from './components/App';

let app = new Express ();

app.set ('view engine', 'ejs');
app.set ('views', path.join (__dirname, 'views'));
app.use (Express.static ('dist'));
app.use (bodyParser.json ());
app.use (bodyParser.urlencoded ({ extended: true }));

app.get ('/', (req, res) => {
  let reactHtml = ReactDOMServer.renderToString (<App />);

  res.render ('index', {
    reactOutput: reactHtml
  })
});

app.listen (process.env.PORT || 3000);
