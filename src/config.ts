#!/usr/bin/env node

import inquirer from 'inquirer';
import { cli } from './cli.js';
import { CONFIG, CONFIG_WITHOUT_INSTALL, PACKAGE_MANAGER } from './constants.js';
import { file } from './file.js';
import fs from 'fs';

class Config {
  private async alertOverwrite(fileName: string) {
    return await inquirer.prompt({
      type: 'confirm',
      message: `Overwrite existing ${fileName} file?`,
      name: 'overwrite',
    });
  }
  public async configPrompt(config: keyof typeof CONFIG_WITHOUT_INSTALL) {
    const { fileName } = CONFIG_WITHOUT_INSTALL[config];
    if (this.isExist(fileName)) {
      const { overwrite } = await this.alertOverwrite(fileName);
      return overwrite;
    }
    return true;
  }

  public async setInstall(pkgManager: keyof typeof PACKAGE_MANAGER, config: keyof typeof CONFIG) {
    const { configName, fileName } = CONFIG[config];

    cli.install(pkgManager, configName);
    const configContent = await file.fetch(fileName);
    file.create(fileName, configContent);
  }
  public async setConfig(config: keyof typeof CONFIG_WITHOUT_INSTALL) {
    const { fileName } = CONFIG_WITHOUT_INSTALL[config];
    const ignoreContent = await file.fetch(fileName);
    file.create(fileName, ignoreContent);
  }
  private isExist(fileName: string) {
    return fs.existsSync(fileName);
  }
  public async installPrompt(config: keyof typeof CONFIG) {
    const { configName, fileName, prompt } = CONFIG[config];
    if (this.isExist(fileName)) {
      const { overwrite } = await this.alertOverwrite(fileName);
      return overwrite;
    }
    const promptResult = await inquirer.prompt(prompt);
    return promptResult[configName];
  }
}

export const config = new Config();
