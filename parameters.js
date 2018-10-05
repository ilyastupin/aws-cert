'use strict';

let parameter_index = 2;
let parameters = {parameters: []};

while (parameter_index < process.argv.length) {
    let parameter_name = process.argv[parameter_index].replace(/-/g,'');
    if (process.argv[parameter_index].substr(0,2) === "--") {
       parameters[parameter_name] = "yes";       
       if (parameter_index === process.argv.length - 1) break;
       parameter_index++;
       if (process.argv[parameter_index].substr(0,2) !== "--") parameters[parameter_name] = process.argv[parameter_index];       
    }
    else parameters.parameters.push(parameter_name);
    parameter_index++
}

module.exports = parameters;
