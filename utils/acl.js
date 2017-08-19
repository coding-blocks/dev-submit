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
                        if(stuData) {
                            req.user.dataValues.role = {name: "student", id: stuData.id}
                            return next();
                        }
                        else{
                            res.send("please register as student or teacher")
                        }
                    })
                })
            })
        }
        else next();
    },
    ensureAdmin: function ensureAdmin(req, res, next) {
        console.log(req.user.dataValues.role)
        if (req.user.dataValues.role.name == "admin") return next();
        res.send("You are not an admin")
    },
    ensureTeacher: function (req, res, next) {
        if (req.user.dataValues.role.name == "admin" || req.user.dataValues.role.name == "teacher") return next();
        res.send("You are neither an Admin nor a Teacher")
    }
}