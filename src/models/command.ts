import { ParsedArgs } from 'minimist';

export interface CommandConstructor {
  new(): Command;
}

export abstract class Command {
  public abstract async run(argv: ParsedArgs, token: string): Promise<void>;
}
