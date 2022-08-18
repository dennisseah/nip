import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import { CommandBase } from "./commands/commandBase";

const createMainCommand = (): Command => {
    const program = new Command();
    program.description("Neat Integration Plan");
    program.version("0.0.1");
    program.option("-v, --verbose", "verbose logging");
    return program;
};

const registerSubCommands = (mainCmd: Command): void => {
    const cmdFiles = fs
        .readdirSync(path.join(__dirname, "commands"))
        .filter((f) => f.endsWith(".js") || f.endsWith(".ts"))
        .map((f) => f.replace(/\.[jt]s$/, ""));

    cmdFiles.forEach((m) => {
        const className = m.substring(0, 1).toUpperCase() + m.substring(1);
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mod = require(`./commands/${m}`);

        if (
            className !== "CommandBase" &&
            mod[className] &&
            mod[className].prototype &&
            mod[className].prototype.getCommandName
        ) {
            const cmd = new mod[className]();
            if (cmd instanceof CommandBase) {
                cmd.register(mainCmd);
            }
        }
    });
};

try {
    const mainCmd = createMainCommand();
    registerSubCommands(mainCmd);
    mainCmd.parse();
} catch (ex) {
    console.error((ex as Error).message);
}
