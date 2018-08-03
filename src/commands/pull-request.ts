import { exec } from 'child_process';
import { ParsedArgs } from 'minimist';
import * as request from 'request-promise-native';
import { promisify } from 'util';

import { Command } from '../models/command';

const cmd = promisify(exec);

export class PullRequestCommand extends Command {
  public async run(argv: ParsedArgs, token: string): Promise<void> {
    const currentBranch = await getCurrentBranchName();
    const base = argv.base || argv.b || 'master';
    const head = argv.head || argv.h || currentBranch;

    await assertBranchExists(base);
    await assertBranchExists(head);

    await openPullRequest(base, head, token);
  }
}

const openPullRequest = async (base: string, head: string, token: string) => {
  const { owner, repo } = await getOwnerRepo();

  return request.post({
    url: `https://api.github.com/repos/${owner}/${repo}/pulls`,
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Hub-Node'
    },
    json: {
      base,
      head,
    }
  });
}

const getOwnerRepo = async () => {
  const remotes = (await cmd('git remote -v')).stdout;
  const origin = remotes.match(/origin\sgit@github\.com:(\S+)\.git\s\(push\)/);
  if (!origin) {
    throw new Error('Could not determin origin.');
  } else {
    const ownerRepo = origin[1];
    const [ owner, repo ] = ownerRepo.split('/');
    return { owner, repo };
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
