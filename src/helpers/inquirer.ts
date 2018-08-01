import * as inquirer from 'inquirer';

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

export const askForGitHubOTP = async () => {
  const questions = [
    {
      message: 'Enter your GitHub two factor auth code:',
      name: 'otp',
      type: 'input',
      validate: validateIsString('Please enter your two factor auth code.'),
    }
  ];

  return inquirer.prompt(questions) as Promise<{ otp: string }>;
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
