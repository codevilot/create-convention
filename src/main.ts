#!/usr/bin/env node

import inquirer from 'inquirer';
import { CONFIG, CONFIG_WITHOUT_INSTALL, PACKAGE_MANAGER, PACKAGE_MANAGER_PROMPT } from './constants.js';
import { config } from './config.js';
/**
 * 해야할 목록
 * push된 라이브러리 가져오기
 * vs 코드 라이브러리
 */

(async () => {
  const { packageManager }: { packageManager: keyof typeof PACKAGE_MANAGER } = await inquirer.prompt({
    ...PACKAGE_MANAGER_PROMPT,
    type: 'list',
  });
  const prettier = await config.installPrompt(CONFIG.prettier.configName);
  const eslint = await config.installPrompt(CONFIG.eslint.configName);
  const prettierIgnore = await config.configPrompt(CONFIG_WITHOUT_INSTALL.prettier.configName);
  const gitIgnore = await config.configPrompt(CONFIG_WITHOUT_INSTALL.git.configName);
  const vscodeConfig = await config.configPrompt(CONFIG_WITHOUT_INSTALL.vscode.configName);

  if (prettier) await config.setInstall(packageManager, CONFIG.prettier.configName);

  if (eslint) await config.setInstall(packageManager, CONFIG.eslint.configName);

  if (gitIgnore) await config.setConfig(CONFIG_WITHOUT_INSTALL.git.configName);

  if (prettier && prettierIgnore) await config.setConfig(CONFIG_WITHOUT_INSTALL.prettier.configName);

  if (prettier && vscodeConfig) await config.setConfig(CONFIG_WITHOUT_INSTALL.vscode.configName);
})();
