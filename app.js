const express = require("express");
const path = require("path");
const passport = require("passport");
const passport_local = require("passport-local").Strategy;
const flash = require("connect-flash");
const bcrypt = require("bcrypt-nodejs");
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require("./models/database");

const app = express();
const port = 3000;

app.use(session({
    secret: "It's a secret, don't read",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 3600000
    }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

const drugRoute = require("./routes/drug");
const userRoute = require("./routes/user");
const indexRoute = require("./routes/index");
const cartRoute = require("./routes/purchase");

app.use("/manage/drugs", drugRoute);
app.use("/manage/users", userRoute);
app.use(indexRoute);
app.use(cartRoute);

var authenticateUser = (username, password, done) => {
    var sql = "SELECT * FROM user_detail WHERE USER_NAME = ?";
    connection.query(sql, [username], (err, results, fields) => {
        if(err){
            return done(err);
        }
        else {
            if(results[0] == null){
                return done(null, false, {message: "User not found"});
            }
            else {
                try {
                    if(bcrypt.compareSync(password, results[0].USER_PASSWORD)){
                        return done(null, results[0]);
                    }
                    else {
                        return done(null, false, {message: "Incorrect Password, Try again!"});
                    }
                }
                catch(err) {
                    return done(err);
                }
            }
        }
    });
}

passport.serializeUser((user, done) => {
    console.log("serializing user: " + user.USER_ID);
    return done(null, user.USER_ID);
});

passport.deserializeUser((USER_ID, done) => {
    console.log("deserializing: " + USER_ID);
    var sql = "SELECT * FROM user_detail WHERE USER_ID = ?";
    connection.query(sql, USER_ID, (err, user) => {
        done(err, user[0]);
    });
});

passport.use("local-login", new passport_local({
    usernameField: 'username'
}, authenticateUser));

app.listen(port, () => {
    console.log("Server has started");
});

exports.add = (x, y) => {
    return x + y;
}