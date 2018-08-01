import chalk from 'chalk';

import { verifyIsGitRepository } from './helpers/system';
import { getOAuthToken } from './helpers/config';

const main = async () => {
  try {
    await verifyIsGitRepository();

    const token = await getOAuthToken();
    console.log(token);

  } catch (error) {
    console.error(chalk.red(error));
    process.exit(1);
  }
}

main();
