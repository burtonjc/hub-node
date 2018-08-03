import { ParsedArgs } from 'minimist';

import { Command } from '../models/command';

export class PullRequestCommand extends Command {
  public run(argv: ParsedArgs, token: string): void {
    const base = argv.base || argv.b || 'master';
    const head = argv.head || argv.h;

    console.log({ base, head });
  }
}
