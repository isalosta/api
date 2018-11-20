function StringFormating(toformat, str) {
    var formatted = toformat;
    if(str instanceof Array){
        for(var arg in formatted){
            formatted = formatted.replace("{"+arg+"}", str[arg]); //REPLACE IN ARRAY INSIDE OF ARGUMENTS
        }
        return formatted;
    } else {
        formatted = formatted.replace("{"+0+"}", str); //REPLACE STRING ARGUMENT
        return formatted;
    }
}

function JsonParser(mode, content){
    switch(mode){
        case 'JSON': // IF THE OBJECT IS JSON OBJECT
        default:
            return JSON.parse(JSON.stringify(content));
        case 'TEXT': // IF THE OBJECT IS STRING TYPE
            return JSON.parse(content);
    }
}

var LOGGER_READY = true;
var LOGGER_ID = "{0}: <<<X_LOGGER>>> {1}";
var number = 0;
function X_LOGGER(Args, Target, color){
    if(!LOGGER_READY)
        return;

    number += 1;
    col = '\x1b[36m%s\x1b[0m';
    switch(color){
        case 'r':
            col = '\x1b[31m';
            break;

        case 'g' :
            col = '\x1b[5m\x1b[32m';
            break;

        case 'b' :
            col = '\x1b[34m';
            break;

        case 'w' :
            col = '\x1b[1m\x1b[37m';
            break;

        case 'db':
            col = '\x1b[36m\x1b[o';
            break;

        default:
            col = '\x1b[36m\x1b[0m';
            break;
    }
    console.log(col, StringFormating(LOGGER_ID,[number, StringFormating(Args, Target)]));
}


module.exports = {
    StringFormating, JsonParser , X_LOGGER
}