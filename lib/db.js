"use strict";
const Datastore = require('nedb');
const nedb = {};

nedb.customers = new Datastore({ filename: 'db/customers.db', autoload: true });
nedb.customers.ensureIndex({ fieldName: 'id', unique: true }, function (err) {});  // Unique ID field


const db = {

   createCustomer: async function(customer){
    let newId = await new Promise((resolve, reject)=>{ //neDb Doesn't do Promises :(
      nedb.customers.findOne({}).sort({ 'id': -1}).exec(function (err, lastCustomer) {  // find customer with highest ID 
        if(err){
          reject(err);
        }
        if(lastCustomer){
          resolve(lastCustomer.id+1)
        }else {
          resolve(1);
        }
      });
    }).catch(err=>{
      // log error
      throw err;
    });
    return new Promise((resolve, reject)=>{
      customer.id = newId;
      customer.status = 'active';
      nedb.customers.insert(customer,  (err, newDoc)=>{
        if(err){
          reject(err);
        }
        resolve(newDoc)
      });
    }).catch(err=>{
      // log error
      throw err;
    });
  },
  getCustomer: function(custId){
    return new Promise((resolve, reject)=>{     
      nedb.customers.findOne({id: parseInt(custId) }, (err, match) => {
        if(err){
          reject(err);
        }
        if(!match){
          reject("No customer with that ID exists in DB");
        }else{
          resolve(match);
        }
      });
    }).catch(err=>{
      // log error
      throw err;
    });
  },
  getCustomers: function(){
    return new Promise((resolve, reject)=>{     
      nedb.customers.find({}, (err, results) => {
        if(err){
          reject(err);
        }
        if(!results){
          reject("No customers in the DB");
        }else{
          resolve(results);
        }
      });
    }).catch(err=>{
      // log error
      throw err;
    });
  },

  updateCustomer:function(custId, update) {
    return new Promise( (resolve, reject) => {      
      nedb.customers.update({id:parseInt(custId)}, {$set:update},{returnUpdatedDocs:true},(err, numAffected, affectedDocuments)=>{
        if(err){
          reject(err);
        }
        if(!affectedDocuments){
          reject("No customer with that ID exists in DB");
        }else{
          resolve(affectedDocuments);
        }
      });
    }).catch(err=>{
      // log error
      throw err;
    });
  },

  clearDb:function() {
    return new Promise( (resolve, reject) => {      
      nedb.customers.remove({}, { multi: true }, async (err, numRemoved) => {
        if(err){
          reject(err);
        }
        nedb.customers.persistence.compactDatafile();
        nedb.customers.on('compaction.done',()=>{
          console.log("database compacted");
          resolve();
        });        
      });
    });
  }
}

module.exports = db;