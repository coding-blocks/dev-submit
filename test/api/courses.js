/**
 * Created by abhishekyadav on 31/08/17.
 */
const chai = require('chai')
    , chaiHttp = require('chai-http')
    , expect = chai.expect
    , should = chai.should()

chai.use(chaiHttp);
const api = chai.request("http://localhost:8000/api/v1/courses");


it("GET / should fetch error", (done) => {
    api.get("/").end((e, r) => {
        r.statusCode.should.equal(404);
        r.body.success.should.equal(false);
        r.body.error.message.should.be.a("string");
        done()
    })
})




it('Should post pandora course ', (done)=> {

    api.post('/new').send({
        "name": "Pandora",
        "assignments": []
    }).end((err, res)=> {
        if (err) {
            return done(err);
        }

        res.statusCode.should.equal(201);
        res.body.data.should.have.property('id');
        res.body.data.should.have.property('name');
        done();
    })


})


it("GET / should fetch all courses", (done) => {
    api.get("/").end((e, r) => {
        if (e) {
            return done(e);
        }
        r.body.success.should.equal(true);
        r.body.data[0].name.should.equal("Pandora");
        done()
    })
})





it("GET /1 should fetch Pandora", (done) => {
    api.get("/1").end((e, r) => {
        r.statusCode.should.equal(200);
        r.body.success.should.equal(true);
        r.body.data.name.should.equal('Pandora');
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

it("PUT /1 should update pandora course",(done)=>{
    api.put("/1").send({
        "name":"pandora",
    }).end((e,r)=>{
        r.statusCode.should.equal(201);
        r.body.success.should.equal(true);
        r.body.data.name.should.equal('pandora');
        done();

    })
})

it("PUT /2 should fetch error",(done)=>{
    api.put("/2").send({
        "name":"launchpad",
    }).end((e,r)=>{
        r.statusCode.should.equal(400);
        r.body.success.should.equal(false);
        r.body.error.message.should.be.a("string");

        done();

    })
})

//TODO
// it("DEL /1 should delete a course Pandora", (done) => {
//     api.delete("/1").end((e, r) => {
//         r.body.success.should.equal(true);
//         done()
//     })
// })



//TODO
// it("DEL /2 should fetch error", (done) => {
//     api.delete("/2").end((e, r) => {
//         r.statusCode.should.equal(404);
//         r.body.success.should.equal(false);
//         r.body.error.message.should.be.a("string");
//         done()
//     })
// })





