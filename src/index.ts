#!/usr/bin/env node

import chalk from 'chalk';
import minimist from 'minimist';

import { PullRequestCommand } from './commands/pull-request';
import { verifyIsGitRepository } from './helpers/system';
import { getOAuthToken } from './helpers/config';
import { CommandConstructor } from './models/command';

const main = async () => {
  try {
    await verifyIsGitRepository();
    await runCommand();
  } catch (error) {
    console.error(chalk.red(error.message || error));
    process.exit(1);
  }
}

interface CommandMap {
  [ commandName: string ]: CommandConstructor;
}

const commands: CommandMap = {
  'pull-request': PullRequestCommand,
  'pr': PullRequestCommand,
};

const runCommand = async () => {
  const argv = minimist(process.argv.slice(2));
  const commandName = argv._[0];
  const command = commands[commandName];

  if (!command) {
    throw new Error(`Unknown command: ${commandName}`);
  }

  const token = await getOAuthToken();
  await (new command()).run(argv, token);
}

main();
