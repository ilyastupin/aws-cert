'use strict';

const extractor = require('./web_extractor.js');
const sha512 = require('js-sha512');
const fs = require('fs');
const logger = require('./logger.js');


const find_questions=`(()=>{   
   var elements = document.getElementsByTagName('li');   
   var htmls = [];
   var parent = null;
   for (i=0; i<=elements.length-1; i++) {
      var element = elements[i];
      if (element.parentElement !== parent) {
         var pattern = ["OL", "LI", "OL"];
         var found = false;      
         var li_node_html = "";
         do {
            if ((element.nodeName === pattern[0])&&(element.className === "")) {
               if (element.nodeName === "LI") li_node_html = element.outerHTML;
               pattern.splice(0,1);
               found = pattern.length === 0;
               if (found) {
                  parent = elements[i].parentElement;
                  htmls.push(li_node_html);
                  break;
               }
            }
            element = element.parentElement;
         } while (element != null)
      }
   }
   return JSON.stringify(htmls)})();
`;



var cached_urls = JSON.parse(fs.readFileSync('jayendrapatil_questions_cache_unique.json'));

(async () => {
   await extractor.init();
   for (var i = 0; i < cached_urls.length; i++) {
      await extractor.navigate("file:///home/ubuntu/aws-cert/jayendrapatil_questions/"+cached_urls[i][1]+".html");
      await extractor.wait_onload_event();
      console.log("file:///home/ubuntu/aws-cert/jayendrapatil_questions/"+cached_urls[i][1]+".html");
      fs.appendFileSync("jayendrapatil_questions_texts.txt","file:///home/ubuntu/aws-cert/jayendrapatil_questions/"+cached_urls[i][1]+".html\n*****************************************************************\n");
      var htmls = JSON.parse((await extractor.evaluate(find_questions)).result.value);
      htmls.forEach(el => fs.appendFileSync("jayendrapatil_questions_texts.txt", el + "\n======================================================================================================\n"));
   }
   extractor.done();
})();

