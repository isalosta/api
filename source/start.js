'use strict'

const express = require('express');
const session = require('express-session');
const uuid = require('uuid/v4');
const fileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const log = require('./util/logger');
const handler = require('./handler');
const Hash = require('./md5Hash');

log.U_LOGS("INIT SERVER");
const Handler = new handler.Handler();
Handler.InitData();

passport.use(new passportLocal (
    { usernameField: 'email' },
    (email, password, done) => {
        log.PROC_LOGS("PASSPORT RES | BEGIN LOGIN");
        Handler.GET_USERBYEMAIL(email).then((dt) => {
            let user = dt;
            if(user.ID == null || user.email == null || user.password == null){
                log.PROC_LOGS("PASSPORT RES | FAIL USER");
                log.U_LOGS("LOGIN FAILED");
                return done(null, false, {message: "WRONG USERNAME"});
            }

            if(Hash.Hash(password) != user.password) {
                log.PROC_LOGS("PASSPORT RES | FAIL PWD");
                log.U_LOGS("LOGIN FAILED");
                return done(null, false, {message: "WRONG PASSWORD"});
            }

            log.PROC_LOGS("PASSPORT RES | COMPLETED | "+JSON.stringify(dt));
            return done(null, user);
        }). catch(err => done(err));
    }
));

passport.serializeUser((user, done) => {
    log.PROC_LOGS("PASSPORT SERIALIZE | "+user.ID);
    done(null, user.ID);
});

passport.deserializeUser((id, done) => {
    log.PROC_LOGS("PASSPORT DESERIALIZED | "+id);
    Handler.GET_USERBYID(id).then((dt) => { 
        log.PROC_LOGS("PASSPORT DESERIALIZE COMPLETE | "+JSON.stringify(dt)); done(null, dt);})
        .catch((err) => {
            log.PROC_LOGS("PASSPORT DESERIALIZED ERROR | "+err);
            done(null, false)});
});

const app = express();

app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Request-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function(req, res, next){

    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            req.rawBody = body;
            console.log(`ON END: ${body}`);
            req.body = JSON.parse(body);
            next();
        });
    } else {
        bodyParser.urlencoded({extended: false});
        next();
    }
});

app.use(session({
    genid: (req) => {
        return uuid();
    },
    store: new fileStore({path: './session'}),
    secret: 'cause_sample',
    cookie: {maxAge: 60000},
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('public'));

app.get('/api', (req, res) => { res.send("<p>NULL</p>"); log.REQUEST_LOGS(req); });

app.post('/api/login', (req, res, next) => {

    log.PROC_LOGS("LOGIN | " + JSON.stringify(req.body));
    passport.authenticate('local', (err, user, info) => {
        log.PROC_LOGS("LOGIN INFO | "+JSON.stringify(user)+" | "+JSON.stringify(info));
        if(info){console.log(info); return res.send(info);}
        if(err){ return next(err);}
        if(!user){ return res.send("ERROR"); }

        req.login(user, (err) => {
            if(err) {log.PROC_LOGS("LOGIN POST | LOGIN FAILED"); return next(err); }
            log.PROC_LOGS("LOGIN POST | LOGIN SUCCESS");
            if(req.isAuthenticated()){
                log.U_LOGS("AUTH SUCCESS");
                res.send({isAuth: true});
                res.cookie
            } else {
                log.U_LOGS("AUTH FAILED");
                res.send({isAuth: false});
            }
        });
    }) (req, res, next);
});

app.get('/api/userdata', (req, res) => { 
    log.REQUEST_LOGS(req);
        if(req.isAuthenticated()) {
        Handler.GET_USERDATA(true, req.user.ID).then((r) => {res.send(r); log.RESPONSE_LOGS(JSON.stringify(r));})
        .catch((err) => {
            log.U_LOGS(err);
        });
    } else {
        Handler.GET_USERDATA(false, "").then((r) => {res.send(r); log.RESPONSE_LOGS(JSON.stringify(r));})
        .catch((err) => {
            log.U_LOGS(err);
        });
    }
});


app.get('/authOk', (req, res) => { 
    if(req.isAuthenticated()){
        console.log(req.user);
        log.U_LOGS("AUTH SUCCESS");
        res.send({isAuth: true});
    } else {
        log.U_LOGS("AUTH FAILED");
        res.send({isAuth: false});
    }
});


app.listen(8800, () => { 
    log.U_LOGS("START SERVER 8800"); 
});