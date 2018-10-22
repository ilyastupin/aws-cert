'use strict';

const fs = require('fs');
var cached_urls = JSON.parse("[" + fs.readFileSync('jayendrapatil_questions_cache.json') + '""]');

var cached_urls_unique = [];

for (var i=0; i<=cached_urls.length-2; i++) if (cached_urls_unique.indexOf(cached_urls[i].url) === -1) cached_urls_unique.push(cached_urls[i]);

console.log(cached_urls_unique.length)

fs.writeFileSync("jayendrapatil_questions_cache_unique.json",JSON.stringify(cached_urls_unique,null,4));