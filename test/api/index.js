const mocha = require('mocha'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    db=require('../../db/models').sequelize ,
    should = chai.should()


chai.use(chaiHttp);

const api = chai.request("http://localhost:8000/api/v1");


//Check for authorization before entering the /api/v1/
it("Status code should be 401", (done) => {

    api.get('/').end((err, res) => {
        let text=JSON.parse(res.text);
        res.statusCode.should.equal(401)
        text.success.should.equal(false)
        text.error.message.should.contain('Please login to continue')
        done();
    })
});
