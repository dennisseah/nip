import { Command } from "commander";
import { Commands } from "./commands/commands";

const createMainCommand = (): Command => {
    const program = new Command();
    program.description("Neat Integration Plan");
    program.version("0.0.1");
    program.option("-v, --verbose", "verbose logging");
    return program;
};

const registerSubCommands = (mainCmd: Command): void => {
    const commands = new Commands();
    const mapCommands = commands.get();

    [...mapCommands.keys()].forEach((name) => {
        const cmd = mapCommands.get(name);
        cmd && cmd.register(name, mainCmd);
    });
};

try {
    const mainCmd = createMainCommand();
    registerSubCommands(mainCmd);
    mainCmd.parse();
} catch (ex) {
    console.error(`\x1b[31m${(ex as Error).message}\x1b[89m\x1b[0m`);
}
