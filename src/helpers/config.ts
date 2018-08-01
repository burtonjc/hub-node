import ConfigStore from 'configstore';

import { createAuthorization } from './github';
import { askForGitHubCredentials } from './inquirer';

const pkg = require('../../package.json');

export const getOAuthToken = async () => {
  const store = new ConfigStore(pkg.name);
  let token = store.get('github.token');

  if (!token) {
    const credentials = await askForGitHubCredentials();
    token = await createAuthorization(credentials);

    store.set('github.token', token);
  }

  return token;
}

