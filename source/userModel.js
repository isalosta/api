'use strict'

const md5 = require('md5');
const log = require('./util/logger');

class User {
    constructor(id, email, passwords, name, gender, address, phone, birthday, city, postcode, reset_token, reset_datetime, user_agree){
        this.id = id;
        this.email = email;
        this.passwords = passwords;
        this.name = name;
        this.gender = gender;
        this.address = address;
        this.phone = phone;
        this.birthday = birthday;
        this.city = city;
        this.postcode = postcode;
        this.reset_token = reset_token;
        this.reset_datetime = reset_datetime;
        this.user_agree = user_agree;

        this.UPDATE_USER_INFO = this.UPDATE_USER_INFO.bind(this);
        this.UPDATE_PASSWORD = this.UPDATE_PASSWORD.bind(this);
        this.UPDATE_TOKEN = this.UPDATE_TOKEN.bind(this);
        log.PROC_LOGS('INIT NEW USER -> '+JSON.stringify(this));
    }

    UPDATE_USER_INFO(name, gender, address, phone, birtday){
        this.name = name;
        this.gender = gender;
        this.address = address;
        this.phone = phone;
        this.birthday = birtday;

        //querry
    }

    UPDATE_PASSWORD(passwords){
        this.passwords = md5(passwords);

        //querry
    }

    UPDATE_TOKEN(token) {
        this.token = token;

        //querry
    }
}

module.exports = {
    User
}