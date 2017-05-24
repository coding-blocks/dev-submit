const express = require('express')
const bp = require('body-parser')
const api_v1 = require('./Routes/api_v1')


const app = express();


app.use(bp.json());
app.use(bp.urlencoded({extended : true}));



app.use('/api/v1',api_v1);


app.listen(4000,() => {
     console.log("we are up and running on port 4000")
});