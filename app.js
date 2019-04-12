"use strict"

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const log = require('simple-node-logger').createSimpleLogger('logs.log');

app.use(helmet());
app.use(bodyParser.json());

const db = require('./lib/db');

//custom Middleware for logging the each request going to the API
app.use((req,res,next) => {
  if (Object.keys(req.body).length > 0) {log.info(req.body)};
  if (Object.keys(req.params).length) {log.info(req.params)};
  if(Object.keys(req.query).length) {log.info(req.query)};
  log.info(`Received a ${req.method} request from ${req.ip} for             ${req.url}`);
next();
});

app.get('/api/customer', async (req, res) => {
  try {
    let customers = await db.getCustomers();
    res.json({
      success:true,
      customers:customers
    });
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to get customer info"
    });
    return;
  }  
});

app.get('/api/customer/:id', async (req, res) => {
  try {
    let customer = await db.getCustomer(req.params.id);
    res.json({
      success:true,
      customer:customer
    });
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to get customer info"
    });
    return;
  }  
  
});

app.post('/api/customer/', async (req, res) => {
  try {
    let customerWithId = await db.createCustomer(req.body['customer']);
    res.json({
      success:true,
      customer:customerWithId
    });
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to create new customer"
    });
    return;
  }
});


app.post('/api/customer/:id/name', async (req, res) => {
  if(!req.body.name){
    res.status(400).json({
      success:false,
      message:"No name provided"
    });
    return;
  }
  try {
    let customerWithId = await db.updateCustomer(req.params.id,{name:req.body.name});
    res.json({
      success:true,
      customer:customerWithId
    });
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to update customer"
    });
    return;
  }
});


app.post('/api/customer/:id/address', async (req, res) => {
  if(!req.body.address){
    res.status(400).json({
      success:false,
      message:"No address provided"
    });
    return;
  }
  try {
    let customerWithId = await db.updateCustomer(req.params.id,{address:req.body.address});
    res.json({
      success:true,
      customer:customerWithId
    });
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to update customer"
    });
    return;
  }
});

app.post('/api/customer/:id/delete', async (req, res) => {
  try {
    let customerWithId = await db.updateCustomer(req.params.id,{name:undefined,address:undefined,status:'deleted'});
    res.json({
      success:true,
      customer:customerWithId
    });
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to update customer"
    });
    return;
  }
});


const server= app.listen(port, () => log.info(`App listening on port ${port}!`));

module.exports = server
