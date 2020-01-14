// const prompt = require('prompt');

// prompt.start();

// while(1){
//   prompt.get(['username', 'email'], function (err, result) {
//     if (err) { return onErr(err); }
//     console.log('Command-line input received:');
//     console.log('  Username: ' + result.username);
//     console.log('  Email: ' + result.email);
// });
// }

// function onErr(err) {
//     console.log(err);
//     return 1;
// }

// const readline = require('readline');

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });

// while(1){
//   rl.question('What do you think of Node.js? ', (answer) => {
//     // TODO: Log the answer in a database
//     console.log(`Thank you for your valuable feedback: ${answer}`);
  
//     rl.close();
//   });
// }

var readline = require('readline');

var input = [];

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.prompt();

function ask(){
  rl.question('What is your favorite food? ', (answer) => {
    console.log(`Oh, so your favorite food is ${answer}`);
    ask();
  });
}

ask();

rl.on('line', function (cmd) {

    // input.push(cmd);
    console.log(cmd);
});

rl.on('close', function (cmd) {

    console.log(input.join('\n'));
    process.exit(0);
});