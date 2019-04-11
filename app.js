"use strict"

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(helmet());
app.use(bodyParser.json());

const db = require('./lib/db');


app.get('/api/customer/:id', async (req, res) => {
  console.log(req.params,req.query);
  try {
    let customer = await db.getCustomer(req.params.id);
    res.json({
      success:true,
      customer:customer
    });
    console.log(customer);
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
  console.log(req.params,req.body);
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

app.get('/api/customer/:id/name', async (req, res) => {
  console.log(req.params,req.query);
  try {
    let customer = await db.getCustomer(req.params.id);
    if(!customer.name){
      res.status(400).json({
        success:false,
        message:"Customer has no name"
      });
      return;
    }
    res.json({
      success:true,
      name:customer.name
    });
    console.log(customer);
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"failed to get customer info"
    });
    return;
  }    
});

app.post('/api/customer/:id/:name', async (req, res) => {
  console.log(req.params,req.body);
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

app.get('/api/customer/:id/address', async (req, res) => {
  console.log(req.params,req.query); 
  try {
    let customer = await db.getCustomer(req.params.id);
    if(!customer.address){
      res.status(400).json({
        success:false,
        message:"Customer has no address"
      });
      return;
    }
    res.json({
      success:true,
      address:customer.address
    });
    console.log(customer);
  }catch(err){
    res.status(400).json({
      success:false,
      error:err,
      message:"Failed to get customer info"
    });
    return;
  }  
});

app.post('/api/customer/:id/:address', async (req, res) => {
  console.log(req.params,req.body);
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


app.listen(port, () => console.log(`App listening on port ${port}!`));
