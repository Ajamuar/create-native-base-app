#! /usr/bin/env node

const { exec } = require("child_process");
const fs = require("fs-extra");

let template = "expo";
let extension = "js";

let arguments = process.argv.slice(2)

arguments.forEach((arg, index) => {
  if (arg.includes("--template=")) {
    template = arg.substring(arg.indexOf("=") + 1);
  } else if (arg.includes("--extension=")) {
    extension = arg.substring(arg.indexOf("=") + 1);
  }
});

let templateURL = "git@github.com:Ajamuar/expo-starter.git";

switch(template) {
  case "expo":
    templateURL = "git@github.com:Ajamuar/expo-starter.git";
    break;
  case "crna":
    templateURL = "git@git.geekyants.com:adityaj/crna-starter-kit.git"
    break;
  case "next":
    templateURL = "git@github.com:Ajamuar/next-starter.git";
    break;
  case "cra":
    templateURL = "git@github.com:Ajamuar/cra-starter.git";
    break;
}

exec(
  `git clone ${templateURL} native-base-starter`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    exec(
      "git clone git@git.geekyants.com:adityaj/nativebase-starter-kit.git",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }

        const {
          createScreenDir,
          getStoryBookScreensCode,
        } = require("./converter/index");

        let screenJSON = fs.readFileSync(__dirname + "/screens.json", "utf8");
        screenJSON = JSON.parse(screenJSON)
        createScreenDir(screenJSON, template, extension);
      }
    );
  }
);
