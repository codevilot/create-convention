#!/usr/bin/env node
import minimist from "minimist";
import request from "axios";
import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import { execSync } from "node:child_process";

const packageManagers = ["npm", "yarn"];
const packageScripts = {
  npm: {
    init: "npm install",
    install: "npm install",
    run: "npm run",
  },
  yarn: {
    init: "yarn",
    install: "yarn add",
    run: "yarn",
  },
};

const [, , keyword] = minimist(process.argv)["_"];

const ROOT_URL =
  "https://raw.githubusercontent.com/codevilot/create-convention/main/template/";

const prettierTarget = "**/*.{ts,tsx,js,jsx,css,json,html}";

const configFileList = [".gitignore", ".prettierrc", ".eslintrc"];

const overwriteMessage = (filename) => {
  return {
    type: "confirm",
    message: `Overwrite existing ${filename} file?`,
    name: "overwrite",
  };
};

init();

function init() {
  checkGitFolder();
}

function checkGitFolder() {
  if (!fs.existsSync("/.git")) {
    console.log(chalk.blue("\ngit init"));
    execSync("git init");
  }
  selectPackageManager();
}

function selectPackageManager() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "packageManager",
        message: "Choose package manager?",
        choices: packageManagers,
      },
    ])
    .then(({ packageManager }) => {
      execSync(`${packageScripts[packageManager].init}`);
      installHusky(packageManager);
    });
}

function installHusky(packageManager) {
  console.log(chalk.blue("\nSetting up husky"));
  execSync(`${packageScripts[packageManager].install} -D husky`);
  execSync(`npx husky install`);
  execSync('npm pkg set scripts.prepare="husky install"');
  execSync(
    `npx husky add .husky/pre-commit "${packageScripts[packageManager].run} lint"`
  );
  installPrettierEslint(packageManager);
}

function installPrettierEslint(packageManager) {
  console.log(chalk.blue("\nSetting up prettier and eslint"));
  execSync(
    `${packageScripts[packageManager].install} -D eslint prettier lint-staged eslint-config-prettier eslint-plugin-prettier`
  );
  execSync(`npm pkg set scripts.format="prettier --write ${prettierTarget}"`);
  execSync(`npm pkg set scripts.lint="npx eslint ${prettierTarget}"`);
  execSync(
    `npm pkg set lint-staged["**/*.{js,jsx,ts,tsx}"]="eslint --fix && prettier --write"`
  );
  FetchConfigFiles();
}

function FetchConfigFiles(installedFileLength = 0) {
  const filename = configFileList[installedFileLength];

  const url = ROOT_URL + (keyword ? keyword : "index") + filename;

  const defaultURL = ROOT_URL + "index" + filename;

  request(url)
    .then(({ data }) => {
      createConfigFile(data, installedFileLength);
    })

    .catch(() => {
      request(defaultURL)
        .then(({ data }) => {
          createConfigFile(data, installedFileLength);
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
function createFile(filecontent, installedFileLength) {
  const filename = configFileList[installedFileLength];
  fs.writeFile(
    filename,
    typeof filecontent === "string" ? filecontent : JSON.stringify(filecontent),
    { encoding: "utf-8" },
    () => {
      console.log(chalk.green(`\n${filename} created!`));
      if (configFileList.length > installedFileLength + 1)
        FetchConfigFiles(installedFileLength + 1);
      else {
        execSync("yarn format");
      }
    }
  );
}

function createConfigFile(filecontent, installedFileLength) {
  const filename = configFileList[installedFileLength];
  fs.stat(filename, (err, file) => {
    if (!file) createFile(filecontent, installedFileLength);
    else
      inquirer.prompt([overwriteMessage(filename)]).then((answer) => {
        if (answer.overwrite) createFile(filecontent, installedFileLength);
        else {
          console.log(`\n${filename} config canceled!`);
          if (configFileList.length > installedFileLength + 1)
            FetchConfigFiles(installedFileLength + 1);
          else execSync("npm run format");
        }
      });
  });
}
