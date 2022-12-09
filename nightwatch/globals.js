const reporter = require('../lib/reporter');
module.exports = {
 after(browser) {
  reporter.publishReport();
 }

}