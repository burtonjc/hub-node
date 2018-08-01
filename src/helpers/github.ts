import * as inquirer from 'inquirer';
import * as request from 'request-promise-native';

import { askForGitHubOTP } from './inquirer';

const pkg = require('../../package.json');

const getHeaders = (headers?: { [prop: string]: any }) => {
  return Object.assign({
    'User-Agent': pkg.name,
  }, headers);
}

export interface ICredentials {
  password: string;
  username: string;
}

export const createAuthorization = async (credentials: ICredentials, otp?: string): Promise<string> =>  {
  try {
    const response = await request.post('https://api.github.com/authorizations', {
      auth: credentials,
      headers: otp ? getHeaders({ 'X-GitHub-OTP': otp }) : getHeaders(),
      json: {
        note: 'hub-node: CLI for GitHub written in NodeJS and available from NPM',
        note_url: 'https://github.com/burtonjc/hub-node',
        scopes: 'repo',
      }
    });

    return response.token;
  } catch (error) {
    if (error.statusCode === 401 && error.response.headers['x-github-otp']) {
      const { otp } = await askForGitHubOTP();

      return createAuthorization(credentials, otp);
    } else {
      return Promise.reject(error);
    }
  }

}
