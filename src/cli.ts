import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";

const program = new Command();
program.description("nip");
program.version("0.0.1");
program.option("-v, --verbose", "verbose logging");

const cmdFiles = fs
    .readdirSync(path.join(__dirname, "commands"))
    .filter((f) => f.endsWith(".js") || f.endsWith(".ts"))
    .map((f) => f.replace(/\.[jt]s$/, ""));

cmdFiles.forEach((m) => {
    const className = m.substring(0, 1).toUpperCase() + m.substring(1);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(`./commands/${m}`);
    const cmd = new mod[className]();
    cmd.register(program);
});

try {
    program.parse();
} catch (ex) {
    console.error((ex as Error).message);
}
