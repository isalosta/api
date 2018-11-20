'use strict'

const util = require('./util.js');

function REQUEST_LOGS(request){
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress || request.socket.remoteAddress || (request.connection.socket ? request.connection.socket.remoteAddress : "UNAVAILABLE");
        util.X_LOGGER("GET/ | {0} | {1} | {2} | {3} | {4}", [ip, request.headers.host, request.sessionID, JSON.stringify(request.user), request.headers["user-agent"]], 'g');
}

function RESPONSE_LOGS(msg){
    util.X_LOGGER("POST >>> {0}", msg, 'r'); 
}

function PROC_LOGS(msg){
    util.X_LOGGER("PROCESS: {0}", msg, 'db'); 
}

function U_LOGS(msg){
    util.X_LOGGER("{0}", [msg], 'w');
}

module.exports = {
    REQUEST_LOGS,
    RESPONSE_LOGS,
    PROC_LOGS,
    U_LOGS
}