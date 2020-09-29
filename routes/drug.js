const express = require("express");
const connection = require("../models/database");
const upload = require("../models/file");
const fs = require('fs');
const router = express.Router({mergeParams: true});

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


router.get("/", (req, res) => {
    var sql = "SELECT * FROM drug_details ORDER BY DRUG_FOR";
    connection.query(sql, (err, drugs, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.render("manage/drugs/drug", {drugs: drugs});
        }
    });
});


router.post("/", isAdmin, (req, res) => {
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            if(req.file == undefined){
                res.render("manage/drugs/new", {message: "Error: No image selected!"});
            }
            else {
                var name = req.body.name;
                var Generic = req.body.Generic;
                var image = req.file.filename;
                var type = req.body.type;
                var price = req.body.price;
                var pharma = req.body.pharma;
                var Indications = req.body.Indications;
                var Therapeutic = req.body.Therapeutic;
                var Pharmacology = req.body.Pharmacology;
                var Dosage =  req.body.Dosage;
                var Overdose = req.body.Overdose;
                var Interaction = req.body.Interaction;
                var Contraindications = req.body.Contraindications;
                var SideEffects = req.body.SideEffects;
                var Pregnancy = req.body.Pregnancy;
                var Precautions = req.body.Precautions;
                var SpecialPopulations = req.body.SpecialPopulations;
                var Storage = req.body.Storage;
                var addedBy = req.user.USER_ID;

                var data = [];
                data.push([name, Generic, image, type, price, pharma, Indications, Therapeutic, Pharmacology, Dosage, Overdose, Interaction, 
                    Contraindications, SideEffects, Pregnancy, Precautions, SpecialPopulations, Storage, addedBy]);

                var sql = "INSERT INTO drug_details (DRUG_NAME, DRUG_GENERIC_NAME, DRUG_IMAGE, DRUG_TYPE, DRUG_PRICE, DRUG_PHARMA, DRUG_INDICATION,";
                    sql += "DRUG_THERAPEUTIC_CLASS, DRUG_PHARMACOLOGY, DRUG_DOSAGE, DRUG_OVERDOSE_EFFECTS, DRUG_INTERACTION, DRUG_CONTRAINDICATIONS,";
                    sql += "DRUG_SIDE_EFFECTS, DRUG_PREGNANCY_AND_LACTATION, DRUG_PRECAUTIONS_AND_WARNINGS, DRUG_USE_IN_SPECIAL_POPULATION,";
                    sql += "DRUG_STORAGE_CONDITIONS, DRUG_ADDED_BY) VALUES ?";
                
                connection.query(sql, [data], (err, result, fields) => {
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong");
                    }
                    else {
                        req.flash("success", "Drug added successfully");
                    }
                    res.redirect("/manage/drugs");
                });
            }
        }
    });
});


router.get("/:id/edit", isAdmin, (req, res) => {
    var id = req.params.id;
    var sql = "SELECT * FROM drug_details WHERE DRUG_ID ='" + id + "'";
    connection.query(sql, (err, details, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/manage/drugs/"+ id + "/details");
        }
        else {
            res.render("manage/drugs/edit", {drugs: details});
        }
    });
});


router.post("/:id", isAdmin, (req, res) => {
    var id = req.params.id;
    upload(req, res, (err) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("/manage/drugs/"+ id + "/details");
        }
        else {
            if(req.file == undefined){
                var name = req.body.name;
                var Generic = req.body.Generic;
                var type = req.body.type;
                var price = req.body.price;
                var pharma = req.body.pharma;
                var Indications = req.body.Indications;
                var Therapeutic = req.body.Therapeutic;
                var Pharmacology = req.body.Pharmacology;
                var Dosage =  req.body.Dosage;
                var Overdose = req.body.Overdose;
                var Interaction = req.body.Interaction;
                var Contraindications = req.body.Contraindications;
                var SideEffects = req.body.SideEffects;
                var Pregnancy = req.body.Pregnancy;
                var Precautions = req.body.Precautions;
                var SpecialPopulations = req.body.SpecialPopulations;
                var Storage = req.body.Storage;
                var addedBy = req.user.USER_ID;

                var sql = 'UPDATE drug_details SET DRUG_NAME = "'+ name + '", DRUG_TYPE ="'+ type + '", DRUG_PRICE ="' + price;
                    sql += '", DRUG_GENERIC_NAME ="' + Generic + '", DRUG_PHARMACOLOGY ="' + Pharmacology + '", DRUG_DOSAGE="' + Dosage + '", DRUG_THERAPEUTIC_CLASS ="' + Therapeutic;
                    sql += '", DRUG_INTERACTION ="' + Interaction + '", DRUG_CONTRAINDICATIONS ="' + Contraindications + '", DRUG_SIDE_EFFECTS ="' + SideEffects;
                    sql += '", DRUG_PREGNANCY_AND_LACTATION ="' + Pregnancy + '", DRUG_PRECAUTIONS_AND_WARNINGS ="' + Precautions;
                    sql += '", DRUG_USE_IN_SPECIAL_POPULATION ="' + SpecialPopulations + '", DRUG_OVERDOSE_EFFECTS ="' + Overdose + '", DRUG_STORAGE_CONDITIONS ="' + Storage;
                    sql += '", DRUG_PHARMA ="'+ pharma + '", DRUG_INDICATION ="'+ Indications + '", DRUG_ADDED_BY ="' + addedBy + '" WHERE DRUG_ID ="' + id + '"';
                
                    connection.query(sql, (err, result, fields) => {
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong");
                        res.redirect("/manage/drugs/"+ id + "/details");
                    }
                    else {
                        req.flash("success", "Drug updated successfully");
                        res.redirect("/manage/drugs/"+ id + "/details");
                    }
                });
            }
            else {
                var name = req.body.name;
                var Generic = req.body.Generic;
                var image = req.file.filename;
                var type = req.body.type;
                var price = req.body.price;
                var pharma = req.body.pharma;
                var Indications = req.body.Indications;
                var Therapeutic = req.body.Therapeutic;
                var Pharmacology = req.body.Pharmacology;
                var Dosage =  req.body.Dosage;
                var Overdose = req.body.Overdose;
                var Interaction = req.body.Interaction;
                var Contraindications = req.body.Contraindications;
                var SideEffects = req.body.SideEffects;
                var Pregnancy = req.body.Pregnancy;
                var Precautions = req.body.Precautions;
                var SpecialPopulations = req.body.SpecialPopulations;
                var Storage = req.body.Storage;
                var addedBy = req.user.USER_ID;

                var sql = 'UPDATE drug_details SET DRUG_NAME = "'+ name + '", DRUG_IMAGE ="'+ image + '", DRUG_TYPE ="'+ type + '", DRUG_PRICE ="' + price;
                    sql += '", DRUG_GENERIC_NAME ="' + Generic + '", DRUG_PHARMACOLOGY ="' + Pharmacology + '", DRUG_DOSAGE="' + Dosage + '", DRUG_THERAPEUTIC_CLASS ="' + Therapeutic;
                    sql += '", DRUG_INTERACTION ="' + Interaction + '", DRUG_CONTRAINDICATIONS ="' + Contraindications + '", DRUG_SIDE_EFFECTS ="' + SideEffects;
                    sql += '", DRUG_PREGNANCY_AND_LACTATION ="' + Pregnancy + '", DRUG_PRECAUTIONS_AND_WARNINGS ="' + Precautions;
                    sql += '", DRUG_USE_IN_SPECIAL_POPULATION ="' + SpecialPopulations + '", DRUG_OVERDOSE_EFFECTS ="' + Overdose + '", DRUG_STORAGE_CONDITIONS ="' + Storage;
                    sql += '", DRUG_PHARMA ="'+ pharma + '", DRUG_INDICATION ="'+ Indications + '", DRUG_ADDED_BY ="' + addedBy + '" WHERE DRUG_ID ="' + id + '"';
                
                    connection.query(sql, (err, result, fields) => {
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong");
                        res.redirect("/manage/drugs/"+ id + "/details");
                    }
                    else {
                        req.flash("success", "Drug updated successfully");
                        res.redirect("/manage/drugs/"+ id + "/details");
                    }
                });
            }
        }
    });
});


router.get("/:id/delete", isAdmin, (req, res) => {
    var id = req.params.id;
    var sql = "SELECT DRUG_IMAGE FROM drug_details WHERE DRUG_ID = '" + id + "'";
    connection.query(sql, (err, drugs, fields) => {
        if(err){
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            var image = drugs[0].DRUG_IMAGE;
            const path = "./public/img/" + image;
            var sql = "DELETE FROM comments_details WHERE DRUG_ID ='" + id + "'";
            connection.query(sql, (err, drugs, fields) => {
                if(err){
                    req.flash("error", "Something went wrong");
                    res.redirect('back');
                }
                else {
                    var sql = "DELETE FROM drug_details WHERE DRUG_ID ='" + id + "'";
                    connection.query(sql, (err, result, fields) => {
                        if(err){
                            req.flash("error", "Something went wrong");
                            res.redirect("/manage/drugs");
                        }
                        else {
                            try {
                                fs.unlinkSync(path);
                            } catch(err) {
                                req.flash("error", "Picture Not deleted");
                                console.error("Picture Not deleted");
                                console.error(err)
                            }
                            req.flash("success", "Drug deleted successfully");
                            res.redirect("/manage/drugs");
                        }
                    });
                }
            });
        }
    });
});


router.get("/new", isAdmin, (req, res) => {
    res.render("manage/drugs/new");
});


router.get("/:id/details", (req, res) => {
    var id = req.params.id;
    try{
        var userID = req.user.USER_ID;
    } catch(e){}

    var sql = "SELECT * FROM drug_details WHERE DRUG_ID ='" + id + "'";
    connection.query(sql, (err, details, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            var sql = "SELECT u.USER_NAME, u.USER_ID, c.COMMENT_ID, c.COMMENT_TEXT, c.COMMENT_DATE FROM user_detail AS u, comments_details AS c WHERE c.USER_ID = u.USER_ID AND DRUG_ID = ?";
            connection.query(sql, [id], (err, comments, fields) => {
                if(err){
                    console.log(err.message);
                    req.flash("error", "Something went wrong");
                    res.redirect('back');
                }
                else {
                    var sql = "SELECT d.DRUG_NAME, c.CART_QUANTITY, c.CART_QUANTITY * D.DRUG_PRICE as PRICE FROM cart_details as C, drug_details as D WHERE c.DRUG_ID = d.DRUG_ID AND c.USER_ID = '" + userID + "' AND c.DRUG_ID = '" + id + "'";
                    connection.query(sql, (err, cart, fields) => {
                        if(err){
                            console.log(err.message);
                            req.flash("error", "Something went wrong");
                            res.redirect('back');
                        }
                        else {
                            res.render("manage/drugs/details", {drugs: details, comments: comments, cart: cart});
                        }
                    });
                }
            })
        }
    });
});


router.post("/:id/comment", isLoggedIn, (req, res) => {
    var id = req.params.id;
    var userid = req.user.USER_ID;
    var text = req.body.text;
    var sql = "INSERT INTO comments_details (COMMENT_TEXT, USER_ID, DRUG_ID) VALUES ('" + text + "','" + userid + "','" + id + "')";
    connection.query(sql, (err, result, fields) => {
        if(err){
            console.log(err.message);
            req.flash("error", "Something went wrong");
        }
        req.flash("success", "Comment added");
        res.redirect("back");
    });
});


router.get("/:drugId/:commentId/edit", isLoggedIn, (req, res) => {
    var drugId = req.params.drugId;
    var commentId = req.params.commentId;
    var sql = "SELECT * FROM comments_details as C, drug_details as D, user_detail as U WHERE D.DRUG_ID = C.DRUG_ID AND U.USER_ID = C.USER_ID AND C.COMMENT_ID = '" + commentId + "'";
    connection.query(sql, (err, results, fields) => {
        if(err) {
            console.log(err.message);
            req.flash("error", "Something went wrong");
        }
        else {
            res.render("manage/drugs/comments", {comments: results});
        }
    });
});


router.post("/:drugId/:commentId/edit", isLoggedIn, (req, res) => {
    var commentId = req.params.commentId;
    var drugId = req.params.drugId;
    var text = req.body.text;
    var sql = "SELECT * FROM comments_details WHERE COMMENT_ID = '" + commentId + "'";
    connection.query(sql, (err, results, fields) => {
        if(err){
            console.log(err.message);
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
        else {
            if(results[0].USER_ID == req.user.USER_ID){
                var sql = "UPDATE comments_details SET COMMENT_TEXT = '" + text + "' WHERE COMMENT_ID = '" + commentId + "'";
                connection.query(sql, (err, results, fields) => {
                    if(err) {
                        console.log(err.message);
                        req.flash("error", "Something went wrong");
                    }
                    else {
                        req.flash("success", "Comment Updated");
                        res.redirect("/manage/drugs/"+ drugId +"/details");
                    }
                });
            }
            else {
                req.flash("error", "You don't have permission for that");
                res.redirect("/manage/drugs/"+ drugId +"/details");
            }
        }
    });
});


router.get("/:drugId/:commentId/delete", isLoggedIn, (req, res) => {
    var commentId = req.params.commentId;
    var drugId = req.params.drugId;
    var sql = "SELECT * FROM comments_details WHERE COMMENT_ID = '" + commentId + "'";
    connection.query(sql, (err, results, fields) => {
        if(err){
            console.log(err.message);
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
        else {
            if((results[0].USER_ID == req.user.USER_ID) || req.user.USER_TYPE == "Moderators"){
                var sql = "DELETE FROM comments_details WHERE COMMENT_ID = '" + commentId + "'";
                connection.query(sql, (err, results, fields) => {
                    if(err) {
                        console.log(err.message);
                        req.flash("error", "Something went wrong");
                        res.redirect("back");
                    }
                    else {
                        req.flash("success", "Comment Deleted");
                        res.redirect("/manage/drugs/"+ drugId +"/details");
                    }
                });
            }
            else {
                req.flash("error", "You don't have permission for that");
                res.redirect("/manage/drugs/"+ drugId +"/details");
            }
        }
    });
});


module.exports = router;