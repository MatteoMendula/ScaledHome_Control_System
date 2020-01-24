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

    return (`[LOG - ${my_caller} - ${new Date()}] type: ${my_type} - message: ${message}\n`);
}

module.exports.myConsoleLog = myConsoleLog;
module.exports.myStringLog = myStringLog;