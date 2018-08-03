import { ParsedArgs } from 'minimist';

export interface CommandConstructor {
  new(): Command;
}

export abstract class Command {
  public abstract run(argv: ParsedArgs, token: string): void;
}
