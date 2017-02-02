var express = require('express');
var port = process.env.PORT || 8080;
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var session = require('express-session');
var configAuth = require('./config/auth.js');
var configDB = require('./config/database.js');
var mongojs = require('mongojs');
var db = mongojs(configDB.url,configDB.collections);
var ObjectId = mongojs.ObjectId;
var bodyParser = require('body-parser');

app.use(express.static('./'));
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine','pug');
app.set('views', __dirname + '/views');
app.use(session({secret: 'theusisthebest'}));
app.use(passport.initialize());
app.use(passport.session());



passport.use(new FacebookStrategy({
  clientID: configAuth.facebookAuth.clientID,
  clientSecret: configAuth.facebookAuth.clientSecret,
  callbackURL: configAuth.facebookAuth.callbackURL
}, function(token, refreshToken, profile, done) {
  return done(null, profile);
}));

require('./app/routes.js')(app, passport, db);
 

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.listen(port, function(){
    console.log('listening');
});