import { ParsedArgs } from 'minimist';
import { promisify } from 'util';
import { exec } from 'child_process';

import { Command } from '../models/command';

const cmd = promisify(exec);

export class PullRequestCommand extends Command {
  public async run(argv: ParsedArgs, token: string): Promise<void> {
    const currentBranch = await getCurrentBranchName();
    const base = argv.base || argv.b || 'master';
    const head = argv.head || argv.h || currentBranch;

    await assertBranchExists(base);
    await assertBranchExists(head);
  }
}

const getCurrentBranchName = async () => {
  const branches = (await cmd('git branch -l')).stdout;
  const branchMatch = branches.match(/\*\s(\S+)/);
  let branch: string;

  if (branchMatch && branchMatch.length) {
    return branchMatch[1];
  } else {
    return null;
  }
}

const assertBranchExists = async (branch: string) => {
  const branches = (await cmd('git branch -l')).stdout;
  const regex = new RegExp(`(?:\\s|^)${branch}(\\s|$)`);

  if (!regex.test(branches)) {
    throw new Error(`Branch does not exist: ${branch}`);
  }
}
