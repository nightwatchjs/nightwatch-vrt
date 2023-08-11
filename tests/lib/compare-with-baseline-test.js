const compareWithBaseline = require('../../lib/compare-with-baseline');
const getVrtSettings = require('../../lib/get-vrt-settings');
const getBaselineScreenshotOrCreate = require('../../lib/get-baseline-screenshot-or-create');
const saveScreenshot = require('../../lib/save-screenshot');
const generateScreenshotFilePath = require('../../lib/generate-screenshot-file-path');
const promptScreenshotOverride = require('../../lib/prompt-screenshot-override');
const overrideBaseline = require('../../lib/override-baseline');
const cleanupScreenshots = require('../../lib/cleanup-screenshots');
const reporter = require('../../lib/reporter');
const Jimp = require('jimp');

jest.mock('../../lib/get-vrt-settings');
jest.mock('../../lib/get-baseline-screenshot-or-create');
jest.mock('../../lib/save-screenshot');
jest.mock('../../lib/generate-screenshot-file-path');
jest.mock('../../lib/prompt-screenshot-override');
jest.mock('../../lib/override-baseline');
jest.mock('../../lib/cleanup-screenshots');
jest.mock('../../lib/reporter');
jest.mock('jimp');

describe('compareWithBaseline', () => {
  let nightwatchClient;
  let screenshot;
  let fileName;
  let overrideSettings;
  let context = {client: {settings: {}, reporter: {}}};
  const processCwdMockedValue = '/full/path';
  const mockedFullPath = '/full/path/to/screenshot.png';
  const mockedRelativePath = '/to/screenshot.png';

  beforeEach(() => {
    nightwatchClient = {
      capabilities: {browserName: 'chrome'},
      currentTest: {module: 'testModule', name: 'testName'}
    };
    screenshot = {};
    fileName = 'testFileName';
    overrideSettings = {};
    context = {client: {settings: {}}};
    jest.spyOn(process, 'cwd').mockReturnValue(processCwdMockedValue);
    generateScreenshotFilePath.mockReturnValue(mockedFullPath);
    getBaselineScreenshotOrCreate.mockResolvedValue(screenshot);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should handle identical screenshots', async () => {
    getVrtSettings.mockReturnValue({
      threshold: 0.1
    });
    Jimp.diff.mockReturnValue({percent: 0.1});

    const result = await compareWithBaseline(
      nightwatchClient,
      screenshot,
      fileName,
      overrideSettings,
      context
    );

    expect(cleanupScreenshots).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should handle non-identical screenshots', async () => {
    getVrtSettings.mockReturnValue({
      threshold: 0.1,
      prompt: false,
      updateScreenshots: false
    });

    Jimp.diff.mockReturnValue({percent: 0.5});

    const result = await compareWithBaseline(
      nightwatchClient,
      screenshot,
      fileName,
      overrideSettings,
      context
    );

    expect(saveScreenshot).toHaveBeenCalledTimes(2);
    expect(reporter.insertData).toHaveBeenCalled();
    expect(reporter.insertData).toHaveBeenCalledWith(undefined, {
      browserName: nightwatchClient.capabilities.browserName,
      testModule: nightwatchClient.currentTest.module,
      assertionName: nightwatchClient.currentTest.name,
      completeBaselinePath: mockedRelativePath,
      completeDiffPath: mockedRelativePath,
      completeLatestPath: mockedRelativePath,
      diff: 0.5
    });
    expect(result).toBe(false);
  });
});
