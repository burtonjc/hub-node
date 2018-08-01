import ConfigStore from 'configstore';
import * as inquirer from 'inquirer';

import { createAuthorization } from './github';

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

export const askForGitHubCredentials = async () => {
  const questions = [
    {
      message: 'Enter your GitHub username or e-mail address:',
      name: 'username',
      type: 'input',
      validate: validateIsString('Please enter your username or e-mail address.'),
    },
    {
      message: 'Enter your password:',
      name: 'password',
      type: 'password',
      validate: validateIsString('Please enter your password.'),
    }
  ];

  return inquirer.prompt(questions) as Promise<{ username: string, password: string }>;
}

const validateIsString = (failMessage: string) => {
  return (value: string) => {
    if (value.length) {
      return true;
    } else {
      return failMessage;
    }
  };
}
