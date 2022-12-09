

/*
  envs (nightwatch_config_env, browsername): {
    chrome: {
      modules: {
        <module_name>: {
          completed: {
            <screenshot_assertion_name/screenshot_filename>: {
              completeBaselinePath:,
              completeDiffPath,
              completeLatestPath

            }
          }
        }
      }
    }
  }
*/
class Reporter {

  constructor() {
    this.reports = {};
  }

  insertData({browserName, platformName, assertionName, testModule, completeBaselinePath, completeDiffPath, completeLatestPath}) {
    if (!this.reports[browserName]) {
      this.reports[browserName] = {modules: {}};
    }
    this.reports[browserName].modules[testModule] = {
      completed: {
        [assertionName]: {
          completeBaselinePath,
          completeDiffPath,
          completeLatestPath
        }
      }
    };
  }

  publishReport() {
    // invoke html-reporter method to generate index.html with the data present.
  }

   
}

module.exports = new Reporter();

