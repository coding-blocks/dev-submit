const mocha = require('mocha'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../server'),
    should = chai.should();

function importTest(name, path) {
    describe(name, function () {
        require(path);
    });
}

// before(function (done) {
//     config.DEV_MODE = true;
//     db.sync({force: true}).then(() => {
//         console.log("DB configured for tests")
//         app.listen(8000, () => done())
//     })
// })