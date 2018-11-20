'use strict'

var crypt = require('md5');

function Hash(string) {
    return crypt(string);
}

module.exports = {
    Hash
}