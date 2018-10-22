'use strict';

const extractor = require('./web_extractor.js');
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


var cached_urls_unique = JSON.parse(fs.readFileSync('jayendrapatil_questions_cache_unique.json'));
/*
(async () => {
   await extractor.init();
   for (var i=0; i<cached_urls_unique.length; i++) {
      console.log("CACHED: "+cached_urls_unique[i][0]);
      await extractor.navigate("file:///home/ubuntu/aws-cert/jayendrapatil_questions/"+cached_urls_unique[i][1]+".html");
      await extractor.wait_onload_event();      
   }
   extractor.done();
})();
*/


var files=fs.readdirSync("jayendrapatil_questions").filter(element => /\.html$/.test(element));

files.forEach(element => {
   console.log(element);
   var text = fs.readFileSync("jayendrapatil_questions/"+element);
   if (/Questions are collected from Internet and the answers are marked/.test(text)) fs.renameSync("jayendrapatil_questions/"+element,"jayendrapatil_questions/criteria1/"+element)
})
var files=fs.readdirSync("jayendrapatil_questions").filter(element => /\.html$/.test(element));

files.forEach(element => {
   console.log(element);
   var text = fs.readFileSync("jayendrapatil_questions/"+element);
   if (/Sample Exam Question :- /.test(text)) fs.renameSync("jayendrapatil_questions/"+element,"jayendrapatil_questions/criteria2/"+element)
})

var files=fs.readdirSync("jayendrapatil_questions").filter(element => /\.html$/.test(element));
files.forEach(element => {
   console.log(element);
   var text = fs.readFileSync("jayendrapatil_questions/"+element);
   if (/AWS Certification Exam Practice Questions/.test(text)) fs.renameSync("jayendrapatil_questions/"+element,"jayendrapatil_questions/criteria3/"+element)
})

var files=fs.readdirSync("jayendrapatil_questions").filter(element => /\.html$/.test(element));
files.forEach(element => {
   console.log(element);
   var text = fs.readFileSync("jayendrapatil_questions/"+element);
   if (/Exam Scenario Question/.test(text)) fs.renameSync("jayendrapatil_questions/"+element,"jayendrapatil_questions/criteria4/"+element)
})

var files=fs.readdirSync("jayendrapatil_questions").filter(element => /\.html$/.test(element));
files.forEach(element => {
   console.log(element);
   var text = fs.readFileSync("jayendrapatil_questions/"+element);
   if (/Sample Exam Questions/.test(text)) fs.renameSync("jayendrapatil_questions/"+element,"jayendrapatil_questions/criteria5/"+element)
})

//Sample Exam Questions

var files=fs.readdirSync("jayendrapatil_questions").filter(element => /\.html$/.test(element));

files.forEach(element => {
   console.log(element);
   var text = fs.readFileSync("jayendrapatil_questions/"+element);
   if (/AWS Certified Solutions Architect – Associate Feb 2018 Exam Learning Path/.test(text) ||
       /Solr facet distinct count/.test(text)) fs.renameSync("jayendrapatil_questions/"+element,"jayendrapatil_questions/nothing/"+element)
})



//Exam Scenario Question

//AWS Certified Solutions Architect – Associate Feb 2018 Exam Learning Path
//Solr facet distinct count

