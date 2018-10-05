'use strict';

const sha512 = require('js-sha512');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin
});

let text = '';

rl.on('line', (input) => {
  text += input;
}).on('close', () => {
  console.log(sha512(text));
  process.exit(0);
});

