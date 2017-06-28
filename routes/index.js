/**
 * Created by tech4GT on 6/25/17.
 */
const express = require('express');
const bp = require('body-parser');
const router = express.Router();

router.use(bp.json());
router.use(bp.urlencoded({extended: true}));


router.get('/', function (req, res) {
    console.log(req.user)
    if(!req.isAuthenticated()){
        req.flash('error_msg','you are not logged in');
        res.redirect('/users/login')
    }
    else{
        res.render('index');
    }
});


module.exports = router;