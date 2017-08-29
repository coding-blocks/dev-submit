/**
 * Created by abhishekyadav on 24/08/17.
 */
const chai = require('chai')
    , chaiHttp = require('chai-http')
    , expect = chai.expect
    , should = chai.should();

chai.use(chaiHttp);
const api = chai.request("http://localhost:8000/users");

it("POST / it should register a user", (done) => {
    api.post("/register").send({
        "Name":"Karan Sharma",
        "Username":"karan12",
        "Password":"1234",
        "Password2":"1234",
        "Role":"Student",
        "Email":"karan@gmail.com",
        "Roll":"8"

    }).redirects(0).end((err, res) => {
        res.headers.location.should.contain('users/login')
        res.statusCode.should.equal(302)
        done()
    })
})

