/**
 * Created by abhishekyadav on 31/08/17.
 */
const chai = require('chai')
    , chaiHttp = require('chai-http')
    , expect = chai.expect
    , should = chai.should()

chai.use(chaiHttp);
const api = chai.request("http://localhost:8000/api/v1/batches");

const users = chai.request("http://localhost:8000/users");


before((done)=> {
    users.post('/register').send({
        "Name": "Abhishek Yadav",
        "Username": "abhishek1208",
        "Password": "1234",
        "Password2": "1234",
        "Role": "Teacher",
        "Email": "abhishekyadav120897@gmail.com"


    }).end((e, r)=> {
        if (e) {
            return done(err);
        }
        done();

    });
})


it("GET / should fetch error", (done) => {
    api.get("/").end((e, r) => {
        r.statusCode.should.equal(404);
        r.body.success.should.equal(false);
        r.body.error.message.should.be.a("string");
        done()
    })
})

it('Should post pandorafall batch ', (done)=> {

    api.post('/new').send(
        {
            "code": "pandorafall",
            "teacherId": "1",
            "startDate": "2016-03-25",
            "endDate": "2016-09-25"
        }).end((err, res)=> {
        if (err) {
            return done(err);
        }

        res.statusCode.should.equal(201);
        res.body.data.should.have.property('code');
        res.body.data.should.have.property('teacherId');
        done();
    })


})

it("GET / should fetch all batches", (done) => {
    api.get("/").end((e, r) => {
        if (e) {
            return done(e);
        }
        r.body.success.should.equal(true);
        r.body.data[0].code.should.equal("pandorafall");
        done()
    })
})


it("GET /1 should fetch pandorafall batch", (done) => {
    api.get("/1").end((e, r) => {
        r.statusCode.should.equal(200);
        r.body.success.should.equal(true);
        r.body.data.code.should.equal('pandorafall');
        done()
    })
})

it("GET /2 should fetch error", (done) => {
    api.get("/2").end((e, r) => {
        r.statusCode.should.equal(404);
        r.body.success.should.equal(false);
        r.body.error.message.should.be.a("string");
        done()
    })
})

it("PUT /1 should update pandorafall batch", (done)=> {
    api.put("/1").send({
        "code": "pandorasummer",
        "teacherId": "1",
        "startDate": "2016-03-25",
        "endDate": "2016-09-25"
    }).end((e, r)=> {
        r.statusCode.should.equal(201);
        r.body.success.should.equal(true);
        r.body.data.code.should.equal('pandorasummer');
        done();

    })
})

it("PUT /2 should fetch error", (done)=> {
    api.put("/2").send({
        "name": "launchpad",
        "teacherId": "1",
        "startDate": "2016-03-25",
        "endDate": "2016-09-25"
    }).end((e, r)=> {
        r.statusCode.should.equal(400);
        r.body.success.should.equal(false);
        r.body.error.message.should.be.a("string");

        done();

    })
})

it("DEL /1 should delete course pandora summer", (done)=> {
    api.delete("/1").end((e, r)=> {
        if (e) {
            return done(e);
        }
        r.body.success.should.equal(true);
        r.statusCode.should.equal(200);
        done()

    });
})

it("DEL /2 should fetch", (done)=> {
    api.delete("/2").end((e, r)=> {
        if (e) {
            return done(e);
        }
        r.statusCode.should.equal(404);
        r.body.success.should.equal(false);
        r.body.error.message.should.be.a("string");
        done()

    });
})


