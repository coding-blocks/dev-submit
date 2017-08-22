/**
 * Created by tech4GT on 8/13/17.
 */
const db = require('../db')

module.exports = {
    setRole: function (req, res, next) {
        if (req.user) {
            db.models.Admins.findOne({
                where: {
                    userId: req.user.dataValues.userId
                }
            }).then(function (adminData) {
                if (adminData) {
                    req.user.dataValues.role = {name: "admin", id: adminData.id}
                    return next();
                }
                db.models.Teachers.findOne({
                    where: {
                        userId: req.user.dataValues.userId
                    }
                }).then(function (teacherData) {
                    if (teacherData) {
                        req.user.dataValues.role = {name: "teacher", id: teacherData.id}
                        return next();
                    }
                    db.models.Students.findOne({
                        where: {
                            userId: req.user.dataValues.userId
                        }
                    }).then(function (stuData) {
                        if (stuData) {
                            req.user.dataValues.role = {name: "student", id: stuData.id}
                            return next();
                        }
                        else {
                            res.send("please register as student or teacher")
                        }
                    })
                })
            })
        }
        else {
            console.log("Not logged in")
            next();
        }
    },
    ensureAdmin: function ensureAdmin(req, res, next) {
        if (req.user.dataValues.role.name == "admin") return next();
        res.send("You are not an admin")
    },
    ensureTeacher: function (req, res, next) {
        if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();
        res.send("You are neither an Admin nor a Teacher")
    },
    ensureStudentId:function(req,res,next){
        if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();

        else{
            if (req.params.id == req.user.dataValues.userId){
                return next();
            }
        }
        res.send("You are not authorized!");
    },
    ensureTeacherId:function(req,res,next){
        if (req.user.dataValues.role.name == "admin") return next();

        if(req.user.dataValues.role.name == "teacher"){
            if (req.params.id == req.user.dataValues.userId){
                return next();
            }
        }
        res.send("You are not authorized!");

    },
    ensureOwnUser:function(req, res, next) {
        if(req.user.dataValues.role.name == "admin") return next()
        if (req.params.id == req.user.dataValues.userId) return next();
        res.send("You are not authorised to delete this account")
    },
    ensureUserLogin: function (req, res, next) {
        if (!req.user) {
            res.send("Please login to continue")
        }
        else {
            next()
        }
    },
    ensureBatchOfStudent: function(req,res,next){
        if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();

        db.models.StudentBatch.findAll({
                where:{
                    studentId:req.user.dataValues.role.id
                }
            }).then(function (batches) {
                 for(var entry in batches){
                    console.log("req batch id "+ req.params.batchId+"\n");
                    console.log("entry batch id "+batches[entry].dataValues.batchId+"\n")
                    if(batches[entry].dataValues.batchId==req.params.batchId){
                            return next();
                    }
                }

                res.send("You don't have the right to access batches other than yours!")

        })




    },
    ensureBatchOfTeacher:function(req,res,next){
        if (req.user.dataValues.role.name == "admin") return next();


        if (req.user.dataValues.role.name == "teacher"){
             db.models.Batches.findOne({
                  where:{
                    id:req.param.batchId,
                    teacherId:req.user.role.id
                 }
              }).then(function(batch){
                  if(!batch){
                      res.send("You can have the access of your own batches only")
                  }
                  else{
                      return next();
                  }
             })

        }
        else{
            res.send("You are not authorized");

        }

    }
}