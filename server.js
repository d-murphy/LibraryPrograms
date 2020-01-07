var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(upload.array());
app.use(express.static('public'));

// auth0 code

const path = require('path');
const session = require('express-session');
const passport = require('passport');
const FileStore = require('session-file-store')(session);  
const Auth0Strategy = require('passport-auth0');
const util = require("util");
const url = require('url').Url;
const querystring = require("querystring");

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: 'https://suffolkcountylibraryprograms.herokuapp.com/callback'
  },
  function(accessToken, refreshToken, extraParem, profile, done){
    return done(null, profile);
    
  }
)



passport.use(strategy);
passport.serializeUser(function(user,done){
  done(null,user);
});


//get user by id? 28:49 of https://www.youtube.com/watch?v=-RCnNyD0L-s
passport.deserializeUser(function(user,done){
  done(null,user);
});

app.use(
  session({
    store: new FileStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  res.locals.loggedIn = false;
  if(req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }
  next();
})

const secured = (req, res, next) => {
    if(req.user){ 
      req.session.returnTo = req.originalUrl;
    next();
  } else {
    console.log("No user detected");
    res.redirect("/");
  }
};


// Database connection

const connectionString =
  "mongodb+srv://" + process.env.AdbUn + process.env.adbPw + 
  "@cluster0-hcizx.mongodb.net/" + process.env.dbName;
var mongoose = require('mongoose');
try{
  mongoose.connect(connectionString, {useNewUrlParser: true})
}
catch(err) {console.log("There's an error connecting to the database." + err)};

// declare data model

var programSchema = mongoose.Schema({
  library: String,
  date: Date,
  time: String,
  day: String,
  programName: String,
  programCat: String,
  description: String,
  linkType: String,
  regUrl: String,
  eventActive: String,
  addedby: String, 
  deletedby: String
});
var LibProgram = mongoose.model("LibProgram", programSchema);

// routes



app.get('/addProgram', secured, function(req,res){
  const { _raw, _json, ...userProfile } = req.user;
  var dateOffset = (24*60*60*1000) * 1; //1 day
  var DateRangeStart = new Date(Date.now())
  DateRangeStart.setTime(DateRangeStart.getTime() - dateOffset);
 
  LibProgram.
    find({ date: {$gte: DateRangeStart}, eventActive: "Active" }).
    sort({'library': 1,'date': 1}).
    exec(function (err, programs) {
          if (err) return handleError(err);
          var fullResults = JSON.stringify(programs)
          res.render('libProgram', {
            results: programs, 
            userProfile: userProfile
          });
  });
});

var weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday",
                    "Thursday", "Friday", "Saturday"]

app.post('/addProgram', function(req, res){
   var programInfo = req.body; //Get the parsed information
   if(!programInfo.libName || !programInfo.programName ||
      !programInfo.date || !programInfo.regUrl ||
      !programInfo.desc || !programInfo.programCat ||
      !programInfo.time ){
      res.render('postAddProgram', {
         message: "Sorry, you provided incomplete info", type: "error"});
   } else {
      var newProgram = new LibProgram({
        library: programInfo.libName,
        date: programInfo.date,
        programName: programInfo.programName,
        programCat: programInfo.programCat,
        description: programInfo.desc,
        linkType: programInfo.linkType,
        regUrl: programInfo.regUrl,
        eventActive: "Active", 
        addedby: req.user.displayName, 
        deletedby: ""
      });
     newProgram.day = weekdayNames[newProgram.date.getDay()]
      // set Time
     var timeArray = programInfo.time.split(":");
     if(timeArray[0]>12){
       newProgram.time = (timeArray[0]-12) + ":" + timeArray[1] + " PM";
     } else if (timeArray[0]==12) {
       newProgram.time = (timeArray[0]) + ":" + timeArray[1] + " PM";       
     } else {
       newProgram.time = (timeArray[0]) + ":" + timeArray[1] + " AM";              
     }
     newProgram.date.setHours(timeArray[0]);
     newProgram.date.setMinutes(timeArray[1]);
     newProgram.save(function(err, Person){
         if(err){
            res.render('postAddProgram', {message: "Database error", type: "error"});
         } else {
            res.render('postAddProgram', {
               message: "New program added", type: "success",
               addProgram: newProgram});
         }
      });
   }
});

var handleError = function(err){
  console.log (err);
}

app.get('/', function(req, res){

  var dateOffset = (24*60*60*1000) * 1; //1 day
  var DateRangeStart = new Date(Date.now())
  DateRangeStart.setTime(DateRangeStart.getTime() - dateOffset);
 
  LibProgram.
    find({ date: {$gte: DateRangeStart}, eventActive: "Active" }).
    sort('date').
    exec(function (err, programs) {
          if (err) return handleError(err);
          var fullResults = JSON.stringify(programs)
          res.render('homepage', {results: programs});
  });
});

app.get('/deleteProgram/:id', function(req, res){
   LibProgram.findByIdAndUpdate(req.params.id, 
                                {eventActive: "Inactive", deletedby: req.user.displayName}, 
                                {new: true}, 
                                function(err, response){
      if(err){
        res.render('postDelProgram', {message: "Database error", type: "error"});
      } else {
        res.render('postDelProgram', {type: "success", removedProgram: response});
        console.log(response);
      }
   });
});


app.get('/login', passport.authenticate('auth0', {
    clientID: process.env.AUTH0_CLIENT_ID, 
    domain: process.env.AUTH0_DOMAIN, 
    redirectUri: 'https://suffolkcountylibraryprograms.herokuapp.com/',
    responseType: 'code',
    audience: 'https://dev-5uhhmfa3.auth0.com/api/v2/',
    scope: 'openid email profile'}),
        function(req,res) {
          res.redirect('/callback');
    }
); 

app.get('/logout', function (req,res) {
  // advice from:  https://community.auth0.com/t/having-trouble-with-logout-on-the-sample-nodejs-app/18172/10
  // and calvincs 1/27 comment:  https://community.auth0.com/t/having-trouble-with-logout-on-the-sample-nodejs-app/18172/10  
  //passport logout
  req.logout();
  if (req.session) {
   req.session.destroy(function(err) {
     if (err) {
        console.log(err);
      }
  //auth0 logout
   const logoutUrl = 'https://' + process.env.AUTH0_DOMAIN + 
                    '/v2/logout?client_id=' + process.env.AUTH0_CLIENT_ID + 
                    '&returnTo=https://suffolkcountylibraryprograms.herokuapp.com/';        
   res.redirect(logoutUrl);
    })
  }
});


app.get('/callback', function (req, res, next) {
  passport.authenticate('auth0', function (err, user, info) {
    if (err) { 
      console.log(err);
      console.log("log from callback function");
      return next(err); 
    }
    if (!user) { 
      return res.redirect('/failure'); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect('/addProgram');
    });
  })(req, res, next);
});


app.get('/failure', function(req,res,next) {
  res.render('failure');
});

app.get('/nonLibEmail', function(req,res,next) {
  res.render('nonLibEmail');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
