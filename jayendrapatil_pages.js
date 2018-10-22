'use strict';

const extractor = require('./web_extractor.js');
const sha512 = require('js-sha512');
const fs = require('fs');
const logger = require('./logger.js');


const get_clickable_urls=`(()=>{   
   var elements = document.getElementsByTagName('A');
   var urls = [];
   for (i=0; i<=elements.length-1; i++) {
      urls.push(elements[i].href)
   }
   return JSON.stringify(urls)})();
`;


const exceptions = [
'http://jayendrapatil.com/',
'http://jayendrapatil.com/feed/',
'http://jayendrapatil.com/comments/feed/',
'http://jayendrapatil.com/comments/wp-json/',
'http://jayendrapatil.com/comments/about/',
'http://jayendrapatil.com/comments/contact/',
'http://jayendrapatil.com/about/',
'http://jayendrapatil.com/contact/'
];


var handled_urls = [];
var cached_urls = JSON.parse("[" + fs.readFileSync('jayendrapatil_questions_cache.json') + '""]');



async function handle_one_page(url) {
   if (handled_urls.indexOf(url)!==-1) return;
   logger.info(url);
   handled_urls.push (url);
   var index = cached_urls.findIndex(element => element[0]===url);
   if (index ===-1) {
      await extractor.navigate(url);
   } 
   else {
      console.log("CACHED: "+url);
      await extractor.navigate("file:///home/ubuntu/aws-cert/jayendrapatil_questions/"+cached_urls[index][1]+".html");
   }
   await extractor.wait_onload_event();
   var page_HTML = (await extractor.evaluate('document.documentElement.innerHTML')).result.value;
   var filename = sha512(page_HTML);
   fs.writeFileSync ('jayendrapatil_questions/'+filename+'.html', page_HTML);
   if (index ===-1) fs.appendFileSync ('jayendrapatil_questions_cache.json','["'+url+'","'+filename+'"],\n')
   var urls = JSON.parse((await extractor.evaluate(get_clickable_urls)).result.value);
   for (var i = 0; i < urls.length; i++) urls[i] = urls[i].split('#')[0];
   urls = Array.from(new Set(urls
     .filter(url => /^http:\/\/jayendrapatil.com/.test(url))
     .filter(url => exceptions.indexOf(url)===-1)))
     .filter(url => handled_urls.indexOf(url)===-1)
   for (var i = 0; i < urls.length; i++) await handle_one_page(urls[i])
}

(async () => {
   await extractor.init();
   await handle_one_page('http://jayendrapatil.com');
   extractor.done();
})();


