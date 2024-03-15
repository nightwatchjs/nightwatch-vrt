'use strict';

const path = require('path');

const DEVELOPMENT = process.env.NODE_ENV === 'development';

const REPORTS_PATH = path.join(__dirname, 'reports', 'e2e');
const SCREENSHOT_PATH = path.join(__dirname, 'reports', 'screenshots');

function defaultScreenshotPath(nightwatchClient, basePath, fileName) {
  return path.join(
    nightwatchClient.options.screenshotsPath || basePath || ('reports/screenshots'),
    nightwatchClient.options.desiredCapabilities.platform || 'ANY',
    (nightwatchClient.options.desiredCapabilities.browserName || 'UNKNOWN'),
    (nightwatchClient.options.desiredCapabilities.version || 'UNKNOWN'),
    nightwatchClient.currentTest.name,
    fileName.replace(/ /g, '_')
  );
}

module.exports = {
  'src_folders': [
    'demo/tests'
  ],
  'custom_assertions_path': [
    path.join(process.cwd(), 'nightwatch', 'assertions')
  ],
  'custom_commands_path': [
    path.join(process.cwd(), 'nightwatch', 'commands')
  ],
  'output_folder': REPORTS_PATH,
  'webdriver': {
    'start_process': true,
    'server_path': ''
  },
  'test_settings': {
    'default': {
      'silent': true,
      'visual_regression_settings': {
        'generate_screenshot_path': defaultScreenshotPath,
        //"latest_screenshots_path": '',
        'latest_suffix': '.latest',
        //"baseline_screenshots_path": '',
        'baseline_suffix': '.baseline',
        //"diff_screenshots_path": ''
        'diff_suffix': '.diff',
        'threshold': 0.01,
        'prompt': true,
        'updateScreenshots': false
      },
      'screenshots': {
        'enabled': true,
        'path': SCREENSHOT_PATH,
        'on_failure': false,
        'on_error': false
      },
      'globals': {
        'prompt': DEVELOPMENT,
        'waitForConditionTimeout': 5000
      },
      'desiredCapabilities': {
        'browserName': 'chrome'
      }
    },
    'chrome': {
      'desiredCapabilities': {
        'browserName': 'chrome',
        'chromeOptions': {
          'args': ['--start-fullscreen']
        }
      }
    },
    'firefox': {
      'desiredCapabilities': {
        'browserName': 'firefox',
      }
    }
  }
};
