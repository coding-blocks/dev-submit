const mocha = require('mocha'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should();

chai.use(chaiHttp);

const api = chai.request("http://localhost:4000/api/v1");

