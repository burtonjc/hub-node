import chalk from 'chalk';

import { isGitRepository } from './helpers/system';
import { getOAuthToken } from './helpers/config';

const main = async () => {
  if (!await isGitRepository()) {
    console.error(chalk.red('This is not a git repository!'));
    process.exit();
  }

  const token = await getOAuthToken();

  console.log(token);
}

main();
