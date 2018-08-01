import * as fs from 'fs';

export const verifyIsGitRepository = () => {
  return new Promise((resolve, reject) => {
    fs.stat(`${process.cwd()}/.git`, (err, result) => {
      if (err || !result.isDirectory()) {
        reject('This is not a git repository!');
      } else {
        resolve();
      }
    });
  });
}
