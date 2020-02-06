var houseSettings = require("../constant/houseSettings");

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

function getHeader(){
    var header = 'TIME'
    header += houseSettings.csv_separator+'OUT_T[*C]'
    header += houseSettings.csv_separator+'OUT_H[%]'
    header += houseSettings.csv_separator+'T6[*C]'
    header += houseSettings.csv_separator+'H6[%]'
    header += houseSettings.csv_separator+'T12[*C]'
    header += houseSettings.csv_separator+'H12[%]'
    header += houseSettings.csv_separator+'T18[*C]'
    header += houseSettings.csv_separator+'H18[%]'
    header += houseSettings.csv_separator+'T19[*C]'
    header += houseSettings.csv_separator+'H19[%]'
    header += houseSettings.csv_separator+'T24[*C]'
    header += houseSettings.csv_separator+'H24[%]'
    header += houseSettings.csv_separator+'T25[*C]'
    header += houseSettings.csv_separator+'H25[%]'
    header += houseSettings.csv_separator+'T26[*C]'
    header += houseSettings.csv_separator+'H26[%]'
    header += houseSettings.csv_separator+'LAMP_STATE'
    header += houseSettings.csv_separator+'FAN_STATE'
    header += houseSettings.csv_separator+'AC_STATE'
    header += houseSettings.csv_separator+'HEATER_STATE'

    for (var motor in houseSettings.allowed_motors) {
        if (Object.prototype.hasOwnProperty.call(houseSettings.allowed_motors, motor)) {
            header += houseSettings.csv_separator + 'M' + houseSettings.allowed_motors[motor];
        }
    }
    return header
}

// module.exports.myConsoleLog = myConsoleLog;
// module.exports.myStringLog = myStringLog;

module.exports = {
    myConsoleLog: myConsoleLog,
    myStringLog: myStringLog,
    getHeader: getHeader
}