const express = require('express')
const bp = require('body-parser')
const api_v1 = require('./Routes/api_v1')
const validator = require('express-validator');


const app = express();

app.set("view engine", "hbs");
app.use(validator({

     errorFormatter: function (param, msg, value) {
          var namespace = param.split('.')
              , root = namespace.shift()
              , formParam = root;

          while (namespace.length) {
               formParam += '[' + namespace.shift() + ']';

          }
          return {
               param : formParam,
               msg : msg,
               value : value
          };
     }
}));

app.use(bp.json());
app.use(bp.urlencoded({extended : true}));



app.use('/api/v1',api_v1);


app.listen(4000,() => {
     console.log("we are up and running on port 4000")
});