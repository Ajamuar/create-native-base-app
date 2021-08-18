#! /usr/bin/env node

const { exec } = require("child_process");

exec(
  "git clone git@github.com:Ajamuar/expo-starter.git",
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

        const screenJSON = getStoryBookScreensCode();
        createScreenDir(screenJSON);
      }
    );
  }
);
