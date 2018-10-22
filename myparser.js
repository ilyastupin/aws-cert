var fs = require('fs');


var text = fs.readFileSync("jayendrapatil_questions_texts.txt", "utf8");

var lines = text.split('\n');

lines.forEach(line => {
   
   console.log(line)
   });

