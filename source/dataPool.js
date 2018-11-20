'use strict'
const log = require('./util/logger');

class Data {
    constructor(user){
        this._user = user;
        log.U_LOGS('INIT NEW DATAPOOL -> '+JSON.stringify(this));
    }
}

module.exports = {
    Data
}