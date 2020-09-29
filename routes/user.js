const express = require("express");
const connection = require("../models/database");
const router = express.Router({mergeParams: true});
const bcrypt = require("bcrypt-nodejs");

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "please Login first");
    res.redirect("/login");
}

function isAdmin(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.USER_TYPE == "Moderators"){
            return next();
        }
        req.flash("error", "You don't have permission for that");
        res.redirect("/");
    }
    req.flash("error", "please Login first");
    res.redirect("/login");
}

function isAccountOwner(req, res, next) {
    if(req.isAuthenticated()){
        if(req.params.id == req.user.USER_ID){
            return next();
        }
        req.flash("error", "You don't have permission for that");
        res.redirect("/");
    }
    req.flash("error", "please Login first");
    res.redirect("/login");
}


router.get("/", isLoggedIn, (req, res) => {
    var sql = "SELECT * FROM user_detail ORDER BY USER_TYPE";
    connection.query(sql, (err, users, fileds) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else{
            res.render("manage/users/user", {users: users});
        }
    });
});


router.get("/:id/edit", isAdmin, (req, res) => {
    var id = req.params.id;
    var sql = "SELECT * FROM user_detail WHERE USER_ID = ?";
    connection.query(sql, [id], (err, results, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else{
            res.render("manage/users/edit", {users: results, referer:req.headers.referer});
        }
    });
});


function edit(req, res, path){
    var id = req.params.id;
    var username = req.body.username;
    var password = req.body.password.trim();
    var password2 = req.body.password2.trim();
    var type = req.body.type;
    var gender = req.body.gender;
    var email = req.body.email;
    var date = req.body.date;
    var Phone = req.body.Phone;
    var Address = req.body.Address;
    if(type == undefined) {
        type = "user";
    }
    var sql = "SELECT * FROM user_detail WHERE USER_ID = ?";
    connection.query(sql, [id], (err, results, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect(path);
        }
        else {
            if(password.codePointAt(0) == undefined){
                var sql = "UPDATE user_detail SET USER_NAME = '" + username + "', USER_TYPE = '" + type + "', USER_GENDER = '";
                    sql += gender + "', USER_EMAIL = '" + email + "', USER_PHONE_NO = '" + Phone + "',USER_ADDRESS = '" + Address + "', USER_BDAY = '" + date + "' WHERE USER_ID = '" + id + "'";
                connection.query(sql, (err, results, fields) => {
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong");
                        res.redirect(path);
                    }
                    else {
                        req.flash("success", "User updated successfully");
                        if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-6) !== "/login")) {
                            res.redirect(req.body.referer);
                        }
                        else {
                            res.redirect(path);
                        }
                    }
                });
            }
            else {
                if(password === password2){
                    const salt = bcrypt.genSaltSync(10);
                    const hashedPassword = bcrypt.hashSync(password, salt);
                    var sql = "UPDATE user_detail SET USER_NAME = '" + username + "', USER_PASSWORD = '" + hashedPassword + "', USER_TYPE = '";
                        sql += type + "', USER_GENDER = '" + gender + "', USER_EMAIL = '" + email + "', USER_PHONE_NO = '" + Phone + "',USER_ADDRESS = '" + Address + "', USER_BDAY = '" + date + "' WHERE USER_ID = '" + id + "'";
                    connection.query(sql, (err, results, fields) => {
                        if(err){
                            console.log(err);
                            req.flash("error", "Something went wrong");
                            res.redirect('back');
                        }
                        else {
                            req.flash("success", "User updated successfully");
                            if (req.body.referer && (req.body.referer !== undefined && req.body.referer.slice(-6) !== "/login")) {
                                res.redirect(req.body.referer);
                            }
                            else {
                                res.redirect(path);
                            }
                        }
                    });
                }
                else {
                    req.flash("error", "Password not matched");
                    res.redirect("/manage/users/" + id + "/edit");
                }
            }
        }
    });
}

router.post("/:id/edit", isAdmin, (req, res) => {
    var id = req.params.id;
    var path = "/manage/users";
    edit(req, res, path);
});

router.post("/:id/editUser", isAccountOwner, (req, res) => {
    var id = req.params.id;
    var path = "/manage/users/" + id + "/profile";
    edit(req, res, path);
});

router.get("/:id/editUser", isAccountOwner, (req, res) => {
    var id = req.params.id;
    var sql = "SELECT * FROM user_detail WHERE USER_ID = ?";
    connection.query(sql, [id], (err, results, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else{
            res.render("manage/users/editUser", {users: results, referer:req.headers.referer});
        }
    });
});

router.get("/:id/delete", isAdmin, (req, res) => {
    var id = req.params.id;
    var sql = "DELETE FROM user_detail, comments_details WHERE USER_ID = '" + id + "'";
    connection.query(sql, (err, results, fields) => {
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/manage/users");
        }
        else{
            req.flash("success", "User Deleted successfully");
            res.redirect("/manage/users");
        }
    });
});


router.get("/:id/profile", isLoggedIn,  (req, res) => {
    var id = req.params.id;
    var sql = "SELECT * FROM user_detail WHERE USER_ID = '" + id + "'";
    connection.query(sql, (err, results, fields) => {
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect("/manage/users");
        }
        else {
            var sql = "SELECT d.DRUG_NAME, c.COMMENT_TEXT, c.COMMENT_DATE FROM comments_details as c, user_detail as u, drug_details as d WHERE c.USER_ID = u.USER_ID AND d.DRUG_ID = c.DRUG_ID and u.USER_ID = '" + id + "'";
            connection.query(sql, (err, Comments, fields) => {
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect("back");
                }
                else {
                    var sql = "SELECT d.DRUG_NAME, o.ORDER_QUANTITY, d.DRUG_PRICE * o.ORDER_QUANTITY as TOTAL_PRICE, o.ORDER_DATE FROM order_details as o, drug_details as d WHERE o.DRUG_ID = d.DRUG_ID AND o.USER_ID = '" + id + "'";
                    connection.query(sql, (err, orders, fields) => {
                        if(err){
                            req.flash("error", "Something went wrong");
                            res.redirect("back");
                        }
                        else {
                            res.render("manage/users/profile", {user: results, comments: Comments, orders:orders });
                        }
                    });   
                }
            });
        }
    }); 
});

module.exports = router;
