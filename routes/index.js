const express = require("express");
const connection = require("../models/database");
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const router = express.Router();

router.get("/", (req, res) => {
    res.redirect("/manage/drugs");
});

router.get("/register", (req, res) => {
    res.render("register", {message: req.flash("error")});
});

router.post("/register", (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var gender = req.body.gender;
    var email = req.body.email;
    var date = req.body.date;
    var Address = req.body.Address;
    var Phone = req.body.Phone;
    if(password != password2){
        req.flash("error", "Password not matched, try again");
        res.redirect("/register");
    }
    else {
        var sql = "SELECT * FROM user_detail WHERE USER_NAME ='" + username + "'";
        connection.query(sql, (err, results, fields) => {
            if(err){
                console.log(err.message);
                req.flash("error", "Failed to create account");
                res.redirect("/register");
            }
            else {
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                var data = [];
                data.push([username, hashedPassword, date, gender, email, Address, Phone ]);
                var sql = "INSERT INTO user_detail (USER_NAME, USER_PASSWORD, USER_BDAY, USER_GENDER, USER_EMAIL, USER_ADDRESS, USER_PHONE_NO) VALUES ?";
                connection.query(sql, [data], (err, results, fields) => {
                    if(err){
                        console.log(err.message);
                        req.flash("error", "Failed to create account");
                        res.redirect("/register");
                    }
                    else {
                        console.log("new registration");
                        req.flash("success", "Registration successful")
                        res.redirect("/login");
                    }
                });
            }
        });
    }
});

router.get("/login", (req, res) => {
    res.render("login", {message: req.flash("error"), message: req.flash("success")});
});

router.post("/login", passport.authenticate("local-login", {
    successRedirect: "/manage/drugs",
    failureRedirect: "/login",
    failureFlash: true 
}));

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged out!");
    res.redirect("/");
});

module.exports = router;