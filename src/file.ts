#!/usr/bin/env node

import request from 'axios';
import fs from 'fs';
import { FETCH_FILE_ROOT } from './constants.js';
import chalk from 'chalk';
import { cli } from './cli.js';

const FAILED_TO_FIND_CONVENTION = 'Convention name not found. Applying default configuration file.';

class File {
  public createFolder(folderName: string) {
    if (fs.existsSync(folderName)) return;
    fs.mkdirSync(folderName);
  }
  public completeLog(msg: string) {
    return console.log(chalk.green(msg));
  }
  public create(name: string, content: string) {
    const strContent = typeof content === 'string' ? content : JSON.stringify(content);
    const hasFolder = name.includes('/');
    if (hasFolder) this.createFolder(name.split('/')[0]);
    const completeMsg = () => this.completeLog(`${name} created!`);
    fs.writeFile(name, strContent, { encoding: 'utf-8' }, completeMsg);
  }
  public async fetch(filename: string) {
    const args = cli.getArgs();
    const conventionName = args.length > 0 ? args[0] : 'index';
    const formatedFileName = filename.replace(/\//g, '.');
    const url = FETCH_FILE_ROOT + conventionName + formatedFileName;
    const defaultURL = FETCH_FILE_ROOT + 'index' + formatedFileName;
    try {
      return (await request(url)).data;
    } catch (e) {
      console.log(chalk.red(FAILED_TO_FIND_CONVENTION));
      return (await request(defaultURL)).data;
    }
  }
  public checkExistFile(filename: string) {
    return fs.existsSync(filename);
  }
}

export const file = new File();
