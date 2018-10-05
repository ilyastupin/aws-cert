'use strict';

const extractor = require('./web_extractor.js');
const parameters = require('./parameters.js');
const logger = require('./logger.js');

const exam_area_section = '#content > div';
const first_exam_header_click_command = "document.querySelector('#content > div').getElementsByTagName('A')[0].click()";
const question_list_in_the_right_side = "#tocs-2 > ul";

if (parameters.examurl == null) {
   logger.log('error', 'Empty exam-url parameter!', function(err, level, msg, meta) {
      process.exit(1);
   });
}

(async () => {
   await extractor.init();
   await extractor.navigate(parameters.examurl);
   await extractor.wait_for_selector(exam_area_section);
   await extractor.execute(first_exam_header_click_command);
   await extractor.wait_for_selector(question_list_in_the_right_side);
   let result = JSON.parse(await extractor.get_urls_texts_inside_element(question_list_in_the_right_side));
   result.forEach(el => el.href = el.href.replace(/\/\#$/g,"").replace(/\/$/g,""));
   console.log(JSON.stringify(result));
   extractor.done();
})();


