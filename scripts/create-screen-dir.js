const {
  createScreenDir,
  getStoryBookScreensCode,
} = require("../converter/index");

const screenJSON = getStoryBookScreensCode();
createScreenDir(screenJSON);
