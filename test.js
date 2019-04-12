process.env.NODE_ENV = 'test';
fs = require('fs')

let nedb = require("nedb");

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('./app');
let should = chai.should();
const db = require('./lib/db');

chai.use(chaiHttp);

describe('Customers', () => {


  //Before each test, empty the database
  beforeEach(async () => { 
      await db.clearDb();
  });


  /*
  * Test the /POST route
  */
  describe('/POST customer', async () => {
    //await db.clearDb();
    it('it should create a new customer',  (done) => {
      let customer = {
        name: "Ryan",
        address: {
          street_address: "999 Night Stalker Road",
          postal_code: "12345",
          country: "US"
      }
    }
    
      chai.request(app)
        .post('/api/customer')
        .send({customer:customer})
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
            res.body.should.have.property('success');
            res.body.success.should.be.eql(true);
            res.body.should.have.property('customer');
            res.body.customer.should.have.property('name');
            res.body.customer.name.should.be.eql(customer.name);
            res.body.customer.should.have.property('address');
            res.body.customer.address.should.be.eql(customer.address);            
          done();
        });
    });
  });

  /*
  * Test the /GET route
  */
  describe('/GET/ customer', () => {
    it('it should GET all the customers', (done) => {
      chai.request(app)
      .get('/api/customer')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.eql(true);
        res.body.should.have.property('customers');
        done();
      });
    });
  });

  describe('/GET/ customer', () => {
    it('it should GET all the customers', (done) => {
      chai.request(app)
      .get('/api/customer')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('success');
        res.body.success.should.be.eql(true);
        res.body.should.have.property('customers');
        done();
      });
    });
  });

  describe('/GET/{custId} customer', async () => {
    let customer = {name: "Ryan",address: {street_address: "999 Night Stalker Road",
        postal_code: "12345",country: "US"}
    }
    it('it should GET customer by id', (done) => {
      db.createCustomer(customer).then(()=>{
        chai.request(app)
        .get('/api/customer/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success');
          res.body.success.should.be.eql(true);
          res.body.should.have.property('customer');
          res.body.customer.should.have.property('name');
          res.body.customer.name.should.be.eql(customer.name);
          res.body.customer.should.have.property('address');
          res.body.customer.address.should.be.eql(customer.address); 
          done();
        });
      });
    });
  });

  describe('/POST/:custId/delete customer', async () => {
    let customer = {name: "Ryan",address: {street_address: "999 Night Stalker Road",
        postal_code: "12345",country: "US"}
    }
    await db.createCustomer(customer);
   
  });
  

});