'use strict'

const model = require('./model/dataModel');
const log = require('./util/logger');
const DB = require('./dbManager');
const USER = require('./userModel');
const DATA = require('./dataPool');

class Handler {
    constructor(){
        this.user = new DATA.Data([]);
        this.SET_USER = this.SET_USER.bind(this);
        this.GET_IDX_USER = this.GET_IDX_USER.bind(this);
        this.GET_USERBYEMAIL = this.GET_USERBYEMAIL.bind(this);
        this.GET_USERBYID = this.GET_USERBYID.bind(this);
        this.GET_USERDATA = this.GET_USERDATA.bind(this);
        log.PROC_LOGS("INIT NEW HANDLER -> "+ JSON.stringify(this));
    }

    async InitData() {
        await DB.Get_SQL_Array("SELECT * FROM `ms_user`", this.SET_USER);
     }

    SET_USER(u) {
        let len = u.length;
        let arr = [];
        for(let i = 0; i<len; i++){
            arr.push(new USER.User(u[i].id, u[i].user_email, u[i].user_password, u[i].user_firstname +" "+u[i].user_lastname, u[i].user_gender, u[i].user_address, u[i].user_phone, u[i].user_birthday, u[i].user_city, u[i].user_postcode, u[i].reset_token, u[i].reset_datetime, u[i].user_agree));
            arr[i].address = arr[i].address.replace(/(?:\\[rn]|[\r\n]+)+/g, ' ');
        }
        this.user._user = [...arr];
        log.PROC_LOGS('DB LOAD -> '+ JSON.stringify(this.user._user));
    }

    GET_IDX_USER(id) {
        let idx = -1;
        let len = this.user._user.length;
        
        for(let i = 0; i < len; i++){
            if(this.user._user[i].id == id){
                idx = i;
            }
        }
        len = null;
        return idx;
    }

    GET_USERBYEMAIL(strEmail) {
        console.log(strEmail);
        var idx = -1;
        let email = () => {
            let len = this.user._user.length;
            let mail = ''
            for(let i = 0; i < len; i++){
                if(this.user._user[i].email == strEmail){
                    log.PROC_LOGS("GET USER BY EMAIL | "+strEmail);
                    idx = i;
                    mail = strEmail;
                }
            }
            return mail;
        };

        let data = {
            ID: null,
            email: null,
            password: null
        }

        if(email() == '' || email() == undefined && idx < 0){
            log.PROC_LOGS("GET USER BY EMAIL | FAIL NULL");
            return new Promise(resolve => resolve(data));
        } else {
            console.log(idx);
            console.log(this.user._user[idx]);
            
            data.ID= this.user._user[idx].id;
            data.email= this.user._user[idx].email;
            data.password= this.user._user[idx].passwords;

            log.PROC_LOGS("GET USER BY EMAIL | COMPLETED | "+ JSON.stringify(data));
            return new Promise(resolve => resolve(data));
        }
    }

    GET_USERBYID(strID){
        log.PROC_LOGS("GET USER BY ID | "+strID);
        let idx = this.GET_IDX_USER(strID);

        let data = {
            ID: '',
            email: '',
            password: ''
        }
    
        if(idx > -1) {
            data.ID = this.user._user[idx].id;
            data.email = this.user._user[idx].email;
            data.password = this.user._user[idx].password;
            log.PROC_LOGS("GET USER BY EMAIL | COMPLETED | "+JSON.stringify(data));
            return new Promise(resolve => resolve(data));
        }
    
        log.PROC_LOGS("GET USER BY EMAIL | FAIL | "+JSON.stringify(data));
        return new Promise(resolve => resolve(data));
    }

    GET_USERDATA(isAuth, ID) {
        log.PROC_LOGS("GET USER DATA | "+isAuth +" | "+ID);
        var dt = model.userData;
    
        if(!isAuth) {
            dt.username = "GUEST";
            dt.useremail = '',
            dt.data = {}
            return new Promise(resolve => resolve(dt));
        } else {
            var idx = this.GET_IDX_USER(ID);

            if(idx > -1){
                dt.username = this.user._user[idx].name;
                dt.useremail = this.user._user[idx].email;
                dt.data = {}
                return new Promise(resolve => resolve(dt));
            } else {
                dt.username = "GUEST";
                dt.useremail = '',
                dt.data = {}
                return new Promise(resolve => resolve(dt));
            }
        }
    }
}
    
/*async function GET_USERBYID(strID){
    log.PROC_LOGS("GET USER BY ID | "+strID);
    let idx = storedID.indexOf(strID);
    var data = {
        ID: '',
        email: '',
        password: ''
    }

    if(idx > -1) {
        data.ID = storedID[idx];
        data.email = storedEmail[idx];
        data.password = storedPasswords[idx];
        log.PROC_LOGS("GET USER BY EMAIL | COMPLETED | "+JSON.stringify(data));
        return data;
    }

    log.PROC_LOGS("GET USER BY EMAIL | FAIL | "+JSON.stringify(data));
    return data;
}
 

function SetUser(u){
    for(var i = 0; i < u.length; i++){
        user.PushUser(new USER.User(u[i].id, u[i].user_email, u[i].user_password, u[i].user_firstname +" "+u[i].user_lastname, u[i].user_gender, u[i].user_address, u[i].user_phone, u[i].user_birthday));
        log.PROC_LOGS('DB LOAD -> '+ JSON.stringify(user.user[i]));
    }
}

async function InitData() {
    await DB.Get_SQL_Array("SELECT * FROM `ms_user`", SetUser);
}

async function GET_USERBYEMAIL(strEmail) {
    let email = () => {
        for(let i = 0; i < storedEmail.length; i++){
            if(storedEmail[i] == strEmail){
                log.PROC_LOGS("GET USER BY EMAIL | "+strEmail);
                return strEmail;
            }
        }
    };

    if(email == null || email == undefined){
        log.PROC_LOGS("GET USER BY EMAIL | FAIL NULL");
        return {};
    } else {
        let idx = storedEmail.indexOf(strEmail);
        let data = {
            ID: storedID[idx],
            email: storedEmail[idx],
            password: storedPasswords[idx]
        }
        log.PROC_LOGS("GET USER BY EMAIL | COMPLETED | "+ JSON.stringify(data));
        return data;
    }
}

async function GET_USERBYID(strID){
    log.PROC_LOGS("GET USER BY ID | "+strID);
    let idx = storedID.indexOf(strID);
    let data = {
        ID: '',
        email: '',
        password: ''
    }

    if(idx > -1) {
        data.ID = storedID[idx];
        data.email = storedEmail[idx];
        data.password = storedPasswords[idx];
        log.PROC_LOGS("GET USER BY EMAIL | COMPLETED | "+JSON.stringify(data));
        return data;
    }

    log.PROC_LOGS("GET USER BY EMAIL | FAIL | "+JSON.stringify(data));
    return data;
}

async function getUserdata(isAuth, ID) {
    log.PROC_LOGS("GET USER DATA | "+isAuth +" | "+ID);
    var dt = model.userData;

    if(!isAuth) {
        dt.username = "GUEST";
        dt.useremail = '',
        dt.data = {}
        return dt;
    } else {
        var idx = storedID.indexOf(ID);
        if(idx > -1){
            dt.username = storedName[idx];
            dt.useremail = storedEmail[idx];
            dt.data = {}
            return dt;
        } else {
            dt.username = "GUEST";
            dt.useremail = '',
            dt.data = {}
            return dt;
        }
    }
}*/

module.exports = {
    Handler //, getUserdata, GET_USERBYEMAIL, GET_USERBYID, InitData
}