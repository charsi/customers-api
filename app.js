"use strict"

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(helmet());
app.use(bodyParser.json());

const db = require('./lib/db')

app.get('/api/customer/:id', async (req, res) => {
  console.log(req.params,req.query);  
});

app.post('/api/customer/:id', async (req, res) => {
  console.log(req.params,req.query);  
});

app.get('/api/customer/:id/name', async (req, res) => {
  console.log(req.params,req.query);  
});

app.post('/api/customer/:id/:name', async (req, res) => {
  console.log(req.params,req.query);  
});

app.get('/api/customer/:id/address', async (req, res) => {
  console.log(req.params,req.query);  
});

app.post('/api/customer/:id/:address', async (req, res) => {
  console.log(req.params,req.query);  
});


app.listen(port, () => console.log(`App listening on port ${port}!`));
