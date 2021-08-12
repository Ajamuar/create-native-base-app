const fs = require("fs-extra");

function createScreenDir(screenJSON) {
  // TODO: Fix this
  const screenDirPath =
    "/Users/adityajamuar/Sites/projects/nativebase/storybooks/converter-code/temp/screens";

  const ext = "js";

  if (!fs.existsSync(screenDirPath)) {
    fs.mkdirSync(screenDirPath);
  }

  screenJSON.screens.forEach((screen) => {
    const screenFilePath = `${screenDirPath}/${screen.name}`;
    if (!fs.existsSync(screenFilePath)) {
      fs.mkdirSync(screenFilePath);
    }
    fs.writeFileSync(screenFilePath + `/index.${ext}`, screen.code);
  });
}

module.exports.createScreenDir = createScreenDir;
