'use strict';

const extractor = require('./web_extractor.js');

(async () => {
   await extractor.init();
   await extractor.navigate('http://jayendrapatil.com');
   extractor.wait_onload_event()
   extractor.done();
})();


