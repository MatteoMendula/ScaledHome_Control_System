function myConsoleLog(caller,message,type = 0){
    var my_type;
    var my_caller = caller;
    if (!my_caller){
        my_caller = "Unknwon";
    }
    switch (type) {
        case 0:
            my_type = "Info";
            break;
        case 1:
            my_type = "Warining";
            break;
        case 2:
            my_type = "Error";
            break;
        default:
            my_type = "Unknown"
      }
    console.log(`[LOG - ${my_caller}] type: ${my_type} - message: ${message}`);
}

function myStringLog(caller,message,type = 0){
    var my_type;
    var my_caller = caller;
    if (!my_caller){
        my_caller = "Unknwon";
    }
    switch (type) {
        case 0:
            my_type = "Info";
            break;
        case 1:
            my_type = "Warining";
            break;
        case 2:
            my_type = "Error";
            break;
        default:
            my_type = "Unknown"
      }
    return (`[LOG - ${my_caller} - ${new Date()}] type: ${my_type} - message: ${message}`);
}

function getHeader(separator){
    var header = 'TIME'+separator
    header += 'OUT_T[*C]'+separator
    header += 'OUT_H[%]'+separator
    header += 'T6[*C]'+separator
    header += 'H6[%]'+separator
    header += 'T12[*C]'+separator
    header += 'H12[%]'+separator
    header += 'T18[*C]'+separator
    header += 'H18[%]'+separator
    header += 'T19[*C]'+separator
    header += 'H19[%]'+separator
    header += 'T24[*C]'+separator
    header += 'H24[%]'+separator
    header += 'T25[*C]'+separator
    header += 'H25[%]'+separator
    header += 'T26[*C]'+separator
    header += 'H26[%]'+separator
    header += 'LAMP_STATE'+separator
    header += 'FAN_STATE'+separator
    header += 'AC_STATE'+separator
    header += 'HEATER_STATE'
    return header
}

// module.exports.myConsoleLog = myConsoleLog;
// module.exports.myStringLog = myStringLog;

module.exports = {
    myConsoleLog: myConsoleLog,
    myStringLog: myStringLog,
    getHeader: getHeader
}