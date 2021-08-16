#! /usr/bin/env node

const { exec } = require("child_process");
const {
  createScreenDir,
  getStoryBookScreensCode,
} = require("./converter/index");

exec(
  "git clone git@github.com:Ajamuar/expo-starter.git",
  (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    exec(
      "git clone git@git.geekyants.com:nativebase-pro/nativebase-pro.git",
      (error, stdout, stderr) => {
        if (error) {
          console.error(`error: ${error.message}`);
          return;
        }

        // const screenJSON = getStoryBookScreensCode();
        // createScreenDir(screenJSON);
      }
    );
  }
);
