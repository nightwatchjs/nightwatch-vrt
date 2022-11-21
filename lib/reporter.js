

/*
  env: {
    chrome: {
      module_name: {
        test_block: {
          latest_file:
          diff_file: 
          baseline_file:
        }
      }
    }
  }
*/

class Reporter {

  constructor() {
    this.reports = {};
    this.latestPath;
    this.diffPath;
    this.baselinePath;
  }


  addReport(env, testModule, test, latestImagePath, baseLineImagePath, diffImagePath) {
    if (!this.reports[env]) {
      this.reports[env] = [];
    }
    this.reports.push({
      testModule,
      test: {
        latestImagePath,
        baseLineImagePath,
        diffImagePath
      }
    });
  }

  getBaseLineImagePath(latestImagePath) {
    
  }

  pubishReport() {

  }
   
}

