import { CommandHandler } from "./commandHandler";
import { ListCommand } from "./listCommand";
import { RunCommand } from "./runCommand";
import { VarCacheCommand } from "./varCacheCommand";

export class Commands {
    public get(): Map<string, CommandHandler> {
        const commands = new Map();
        commands.set("run", new RunCommand());
        commands.set("list", new ListCommand());
        commands.set("var-cache", new VarCacheCommand());
        return commands;
    }
}
