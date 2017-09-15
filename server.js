const path = require('path')
const xps = require("./xps.js")
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


const app = xps.app();

xps.go(app,
  {
    staticView: "public", // Also takes an array of strings for multiple view folders.
    viewEngine: "express-handlebars",
    bodyParse: ["json", "raw", "urlencoded", "text"], // TRUE or [ARRAY]
    validator: true,
    cookieParse: true,
    methodOverride: true,
    flash: true,
    httpLogger: "morgan",
    //port: 3000, // Either an INT or STRING
  }
)

// Handle Sessions
// -----------------------------------------------------------------------------
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

// Passport
// -----------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());


// Routes
// -----------------------------------------------------------------------------

// Register
let register = require(path.join(__dirname, "controller/register-view.js"))
app.use("/", register)

// Sign-in
let signin = require(path.join(__dirname, "controller/signin-view.js"))
app.use("/users", signin)

// Members
let member = require(path.join(__dirname, "controller/member-view.js"))
app.use("/users", member)

// Goal
let goal = require(path.join(__dirname, "controller/goal-view.js"))
app.use("/goal", goal)

// Account Edit
let account = require(path.join(__dirname, "controller/user-view.js"))
app.use("/users", account)

// Discover
let discover = require(path.join(__dirname, "controller/discover.js"))
app.use("/discover", discover)

// API's
let register_api = require(path.join(__dirname, "controller/register-api.js"))
app.use("/api/register", register_api)

let signin_api = require(path.join(__dirname, "controller/signin-api.js"))
app.use("/api/signin", signin_api)

let signout_api = require(path.join(__dirname, "controller/signout-api.js"))
app.use("/api/signout", signout_api)

let user_api = require(path.join(__dirname, "controller/user-api.js"))
app.use("/api/user", user_api)

let goal_api = require(path.join(__dirname, "controller/goal-api.js"))
app.use("/api/goal", goal_api)

let task_api = require(path.join(__dirname, "controller/task-api.js"))
app.use("/api/task", task_api)

app.get('*', function(req, res){
  res.render('404');
});


// Database Models
// -----------------------------------------------------------------------------
let db = require('./models')

//
// app.use(expressSession({
//     secret: 'secret',
//     store: db.session,
//     resave: false,
//     saveUninitialized: false,
// }));

db.sequelize.sync().then(function(){
  app.listen(3000, (err)=>{
    if (err) console.log(err)
    console.log("++ Server started on PORT 3000")
  })
})
