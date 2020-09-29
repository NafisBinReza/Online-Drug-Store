const express = require("express");
const connection = require("../models/database");
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

router.post("/manage/drugs/:id/buy", isLoggedIn, (req, res) => {
    var drugId = req.params.id;
    var userId = req.user.USER_ID;
    var quantity = Number(req.body.quantity);
    var sql = "INSERT INTO cart_details (USER_ID, DRUG_ID, CART_QUANTITY) VALUES ('" + userId + "', '" + drugId + "', " + quantity + ")";
    connection.query(sql, (err, result, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect("back");
        }
        else {
            res.redirect("back");
        }
    });
});


router.get("/manage/users/:userID/cart", isLoggedIn, (req, res) => {
    var userID = req.params.userID;
    var sql = "SELECT c.CART_ID, d.DRUG_NAME, d.DRUG_PRICE, c.CART_QUANTITY, d.DRUG_PRICE * c.CART_QUANTITY AS TOTAL_PRICE FROM cart_details AS C, drug_details AS d WHERE c.DRUG_ID = d.DRUG_ID AND c.USER_ID = '" + userID + "'";
    connection.query(sql, (err, cart, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.render("manage/carts/cart", {cart: cart});
        }
    });
});


router.post("/manage/users/:userID/placeOrder", isLoggedIn, (req, res) => {
    var userID = req.params.userID;
    var payment = req.body.payment;
    if(payment == 'Cash'){
        var sql = "INSERT INTO order_details (DRUG_ID, USER_ID, ORDER_QUANTITY) SELECT c.DRUG_ID, c.USER_ID, c.CART_QUANTITY FROM cart_details as c WHERE c.USER_ID = '" + userID + "'";
        connection.query(sql, (err, cart, fields) => {
            if(err){
                console.log(err);
                req.flash("error", "Something went wrong");
                res.redirect('back');
            }
            else {
                var sql = "DELETE FROM cart_details WHERE USER_ID = '" + userID + "'";
                connection.query(sql, (err, result, fields) => {
                    if(err){
                        console.log(err);
                        req.flash("error", "Something went wrong");
                        res.redirect('back');
                    }
                    else {
                        req.flash("success", "Order Placed!");
                        res.redirect("/manage/users/"+userID+"/profile");
                    }
                });
            }
        });
    } 
});


router.get("/manage/carts/:cartID/edit", isLoggedIn, (req, res) => {
    var cartID = req.params.cartID;
    var sql = "SELECT c.CART_ID, d.DRUG_NAME, c.CART_QUANTITY FROM cart_details AS C, drug_details AS d WHERE c.DRUG_ID = d.DRUG_ID AND CART_ID = '" + cartID + "'";
    connection.query(sql, (err, cart, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.render("manage/carts/edit", {cart: cart});
        }
    });
});


router.post("/manage/carts/:cartID/edit", isLoggedIn, (req, res) => {
    var cartID = req.params.cartID;
    var Quantity = Number(req.body.Quantity);
    var sql = "UPDATE cart_details SET CART_QUANTITY = " + Quantity +" WHERE CART_ID = '" + cartID + "'";
    connection.query(sql, (err, result, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.redirect("/manage/users/" + req.user.USER_ID + "/cart")
        }
    });
});


router.get("/manage/carts/:cartID/delete", isLoggedIn, (req, res) => {
    var cartID = req.params.cartID;
    var sql = "DELETE FROM cart_details WHERE CART_ID = '" + cartID + "'";
    connection.query(sql, (err, cart, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.redirect("/manage/users/" + req.user.USER_ID + "/cart")
        }
    });
});


router.get("/manage/orders", isLoggedIn, (req, res) => {
    var sql = "SELECT o.ORDER_ID, o.USER_ID, u.USER_NAME, u.USER_PHONE_NO, o.ORDER_DATE, u.USER_ADDRESS, d.DRUG_NAME, o.ORDER_QUANTITY, o.ORDER_QUANTITY * d.DRUG_PRICE AS PRICE FROM order_details as o, drug_details as d, user_detail as u WHERE o.DRUG_ID = d.DRUG_ID AND u.USER_ID = o.USER_ID ORDER BY o.ORDER_DATE ASC, o.USER_ID ASC";
        
    connection.query(sql, (err, orders, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.render("manage/carts/orders", {orders: orders})
        }
    });
});


router.get("/manage/history", isLoggedIn, (req, res) => {
    var sql = "SELECT o.USER_ID, u.USER_NAME, u.USER_PHONE_NO, o.DELIVERED_DATE, u.USER_ADDRESS, d.DRUG_NAME, o.DELIVERED_QUANTITY, o.DELIVERED_QUANTITY * d.DRUG_PRICE AS PRICE FROM delivered as o, drug_details as d, user_detail as u WHERE o.DRUG_ID = d.DRUG_ID AND u.USER_ID = o.USER_ID ORDER BY o.DELIVERED_DATE ASC, o.USER_ID ASC";
    connection.query(sql, (err, orders, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            res.render("manage/carts/history", {orders: orders})
        }
    });
});

router.get("/manage/delivered/:userID/:orderid", (req, res) => {
    var userID = req.params.userID;
    var orderid = req.params.orderid;
    var sql = "INSERT INTO delivered (DRUG_ID, USER_ID, DELIVERED_QUANTITY) SELECT o.DRUG_ID, o.USER_ID, o.ORDER_QUANTITY FROM order_details as o WHERE o.USER_ID = '" + userID + "' AND o.ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '" + orderid + "')";
    connection.query(sql, (err, result, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            var sql = "DELETE FROM order_details WHERE USER_ID = '" + userID + "' AND ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '" + orderid + "')";
            connection.query(sql, (err, result, fields) => {
                if(err){
                    console.log(err);
                    req.flash("error", "Something went wrong");
                    res.redirect('back');
                }
                else {
                    req.flash("success", "Order Delevered!");
                    res.redirect('back');
                }
            });
        }
    });
});


router.get("/manage/delivered/:userID/:orderid/delete", (req, res) => {
    var userID = req.params.userID;
    var orderid = req.params.orderid;
    var sql = "DELETE FROM order_details WHERE USER_ID = '" + userID + "' AND ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '" + orderid + "')";
    connection.query(sql, (err, result, fields) => {
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong");
            res.redirect('back');
        }
        else {
            req.flash("success", "Order Deleted!");
            res.redirect('back');
        }
    });
});

// DELETE FROM order_details WHERE USER_ID = '66e60b0d-bc2c-11ea-97bf-38d5470f2067' AND ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '712e81e7-bc77-11ea-97bf-38d5470f2067');
// INSERT INTO delivered (DRUG_ID, USER_ID, DELIVERED_QUANTITY) SELECT o.DRUG_ID, o.USER_ID, o.ORDER_QUANTITY FROM order_details as o WHERE o.USER_ID = '66e60b0d-bc2c-11ea-97bf-38d5470f2067' AND o.ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '712e81e7-bc77-11ea-97bf-38d5470f2067'); 
// INSERT INTO delivered (DRUG_ID, USER_ID, DELIVERED_QUANTITY) SELECT o.DRUG_ID, o.USER_ID, o.ORDER_QUANTITY FROM order_details as o WHERE o.USER_ID = '66e60b0d-bc2c-11ea-97bf-38d5470f2067' AND o.ORDER_DATE = (SELECT a.ORDER_DATE FROM order_details as a WHERE a.ORDER_ID = '712e81e7-bc77-11ea-97bf-38d5470f2067')
module.exports = router;