import * as fs from 'fs';

export const isGitRepository = () => {
  return new Promise((resolve, reject) => {
    fs.stat(`${process.cwd()}/.git`, (err, result) => {
      if (!err) {
        resolve(result.isDirectory());
        return;
      }

      if (err.message.startsWith('ENOENT')) {
        resolve(false);
      } else {
        reject(err);
      }
    });
  });
}
