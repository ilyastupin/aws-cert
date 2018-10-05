'use strict';

const extractor = require('./web_extractor.js');

const available_exam_ul='#catAll';

(async () => {
   await extractor.init();
   await extractor.navigate('http://www.briefmenow.org/amazon/');
   await extractor.wait_for_selector(available_exam_ul);
   console.log(await extractor.get_urls_texts_inside_element(available_exam_ul));
   extractor.done();
})();


