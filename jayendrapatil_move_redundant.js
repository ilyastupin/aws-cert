'use strict';

const fs = require('fs');

var cached_urls_unique = JSON.parse(fs.readFileSync('jayendrapatil_questions_cache_unique.json'));

var files=fs.readdirSync('jayendrapatil_questions').filter(element => /\.html$/.test(element));

files.forEach(file=>{
   if (cached_urls_unique.findIndex(element => element[1]+".html" === file) === -1)  fs.renameSync("jayendrapatil_questions/"+file,"jayendrapatil_questions/redundant/"+file)
});

console.log(cached_urls_unique.length);
cached_urls_unique.forEach(element => {if (files.indexOf(element[1]+".html")===-1) console.log(element[1])})
