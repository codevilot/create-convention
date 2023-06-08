#!/usr/bin/env node
import minimist from "minimist";
import request from "axios";
import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import { execSync } from "node:child_process";

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
  pnpm: {
    init: "pnpm install",
    install: "pnpm add",
    run: "pnpm",
  },
};

const packageManagers = Object.keys(packageScripts);

const eslintLibList = {
  "plugin:@typescript-eslint/recommended": "@typescript-eslint/eslint-plugin",
};
const pluginsList = {
  "@typescript-eslint/parser": "@typescript-eslint/parser",
};
const [, , keyword] = minimist(process.argv)["_"];

const ROOT_URL =
  "https://raw.githubusercontent.com/codevilot/create-convention/main/template/";

<<<<<<< HEAD
const prettierTarget = "**/*.{ts,tsx,js,jsx,css}";
=======
const prettierTarget = "*";
>>>>>>> e3cc3cee5fc25e2f769183984b99ea6067aa776a

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
  checkPackageJSON();
}

function checkPackageJSON() {
  if (!fs.existsSync("package.json")) {
    console.log(chalk.blue("\nnpm init -y for creating package.json"));
    execSync("npm init -y");
  }
  checkGitFolder();
}

function checkGitFolder() {
  if (!fs.existsSync(".git")) {
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
  FetchConfigFiles(0, packageManager);
}

function FetchConfigFiles(installedFileLength = 0, packageManager) {
  const filename = configFileList[installedFileLength];

  const url = ROOT_URL + (keyword ? keyword : "index") + filename;

  const defaultURL = ROOT_URL + "index" + filename;

  request(url)
    .then(({ data }) => {
      createConfigFile(data, installedFileLength, packageManager);
    })

    .catch(() => {
      request(defaultURL)
        .then(({ data }) => {
          createConfigFile(data, installedFileLength, packageManager);
        })
        .catch((err) => {
          console.log(err);
        });
    });
}
function createFile(filecontent, installedFileLength, packageManager) {
  const filename = configFileList[installedFileLength];
  fs.writeFile(
    filename,
    typeof filecontent === "string" ? filecontent : JSON.stringify(filecontent),
    { encoding: "utf-8" },
    () => {
      console.log(chalk.green(`\n${filename} created!`));
      if (configFileList.length > installedFileLength + 1)
        FetchConfigFiles(installedFileLength + 1, packageManager);
    }
  );
  if (filename === ".eslintrc") installEslintLib(filecontent, packageManager);
}

function installEslintLib(filecontent, packageManager) {
  const extendsList = filecontent.extends;
  const pluginsList = filecontent.plugins;
  extendsList.forEach((extend) => installLib(extend, packageManager));
  pluginsList.forEach((plugins) => installPlugins(plugins, packageManager));
}

function installPlugins(plugins, packageManager) {
  console.log(pluginsList[plugins], plugins);
  if (pluginsList[plugins])
    execSync(
      `${packageScripts[packageManager].install} ${pluginsList[plugins]} -D`
    );
}

function installLib(extend, packageManager) {
  if (eslintLibList[extend])
    execSync(
      `${packageScripts[packageManager].install} ${eslintLibList[extend]} -D`
    );
}

function createConfigFile(filecontent, installedFileLength, packageManager) {
  const filename = configFileList[installedFileLength];
  fs.stat(filename, (err, file) => {
    if (!file) createFile(filecontent, installedFileLength, packageManager);
    else
      inquirer.prompt([overwriteMessage(filename)]).then((answer) => {
        if (answer.overwrite)
          createFile(filecontent, installedFileLength, packageManager);
        else {
          console.log(`\n${filename} config canceled!`);
          if (configFileList.length > installedFileLength + 1)
            FetchConfigFiles(installedFileLength + 1, packageManager);
        }
      });
  });
}
