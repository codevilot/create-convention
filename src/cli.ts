#!/usr/bin/env node

import chalk from 'chalk';
import { execSync } from 'child_process';
import { PACKAGE_MANAGER } from './constants.js';

class Cli {
  public getArgs() {
    const [_nodePath, _execPath, ...args] = process.argv;
    return [...args];
  }
  public run(cmd: string) {
    return execSync(cmd).toString().trim();
  }
  public install(pkgManager: keyof typeof PACKAGE_MANAGER, lib: string) {
    try {
      const installScript = PACKAGE_MANAGER[pkgManager];
      return this.run(`${installScript.install} -D ${lib}`);
    } catch (e) {
      console.log(chalk.red(`failed to install ${lib}:${e}`));
    }
  }
}

export const cli = new Cli();
