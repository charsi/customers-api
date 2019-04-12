//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
fs = require('fs')

let nedb = require("nedb");
//let Book = require('../app/models/book');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('./app');
let should = chai.should();
const db = require('./lib/db');

chai.use(chaiHttp);
//Our parent block
describe('Customers', () => {
    beforeEach(async () => { //Before each test we empty the database
        await db.clearDb() 
    });


    /*
  * Test the /POST route
  */
  describe('/POST customer', () => {
    it('it should create a new customer', (done) => {
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
            res.body.customer.name.should.be.eql(customer.name);
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
      done();
    });
  });
});

});