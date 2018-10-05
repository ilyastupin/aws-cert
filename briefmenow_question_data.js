'use strict';

const extractor = require('./web_extractor.js');
const parameters = require('./parameters.js');
const logger = require('./logger.js');

const question_area_section = '#post-content > div';
const first_exam_header_click_command = `
   var els = document.querySelector('${question_area_section}').getElementsByTagName('P');
   result = [];
   for (i=0; i <= els.length-1; i++) {
      var el = els[i];
      result.push(el.innerText);
   }
   JSON.stringify(result)
`

if (parameters.questionurl == null) {
   logger.log('error', 'Empty question-url parameter!', function(err, level, msg, meta) {
      process.exit(1);
   });
}

if (parameters.tag == null) {
   logger.log('error', 'Empty tag parameter!', function(err, level, msg, meta) {
      process.exit(1);
   });
}

(async () => {
   await extractor.init();
   let url = parameters.questionurl.replace(/\/\#$/g,"").replace(/\/$/g,"");
   await extractor.navigate(url);
   await extractor.wait_for_selector(question_area_section);
   let result = {url: url, tag: parameters.tag, text: JSON.parse((await extractor.evaluate(first_exam_header_click_command)).result.value)};   
   console.log(JSON.stringify(result));
   extractor.done();
})();
