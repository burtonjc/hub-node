import * as inquirer from 'inquirer';
import * as request from 'request-promise-native';

export interface ICredentials {
  password: string;
  username: string;
}

export const createAuthorization = async (credentials: ICredentials) => {
  let response;

  try {
    response = await request.post('https://api.github.com/authorizations', {
      auth: credentials,
      headers: {
        'User-Agent': 'hub-node'
      },
      json: {
        note: 'hub-node: CLI for GitHub written in NodeJS and available from NPM',
        note_url: 'https://github.com/burtonjc/hub-node',
        scopes: 'repo',
      }
    });
  } catch (error) {
    if (error.statusCode === 401 && error.response.headers['x-github-otp']) {
      const code = await askForGitHub2FA();

      response = await request.post('https://api.github.com/authorizations', {
        auth: credentials,
        headers: {
          'User-Agent': 'hub-node',
          'X-GitHub-OTP': code,
        },
        json: {
          note: 'hub-node: CLI for GitHub written in NodeJS and available from NPM',
          note_url: 'https://github.com/burtonjc/hub-node',
          scopes: 'repo',
        }
      });
    }
  }

  return response.token;
}

export const askForGitHub2FA = async () => {
  const questions = [
    {
      message: 'Enter your GitHub two factor auth code:',
      name: 'code',
      type: 'input',
      validate: validateIsString('Please enter your two factor auth code.'),
    }
  ];

  const { code } = await (inquirer.prompt(questions) as Promise<{ code: string }>);

  return code;
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
