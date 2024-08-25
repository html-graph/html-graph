import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { argv } from "process";

const content = readFileSync("./package.json", "utf8");

const pkg = JSON.parse(content);

const version = pkg.version;

const reg = /(\d+)\.(\d+)\.(\d+)/;

const result = version.match(reg);

const major = parseInt(result[1]);
const minor = parseInt(result[2]);
const patch = parseInt(result[3]) + 1;

const newVersion = `${major}.${minor}.${patch}`;
pkg.version = newVersion;

const newContent = JSON.stringify(pkg, null, 2);

writeFileSync("./package.json", newContent);

const execute = async (cmd: string, cwd: string, params = []): Promise<void> => {
    return new Promise((res, rej) => {
        const proc = spawn(cmd, params, {
            cwd,
            shell: true,
        });

        proc.stderr.setEncoding('utf-8');
        proc.stdout.pipe(process.stdout);
        proc.stderr.pipe(process.stderr);

        proc.on('close', (code) => {
            code == 0 ? res() : rej();
        });
    });
}

const otp = argv[2];

const cmds = [
    `npm publish --access=public --otp=${otp}`,
    `git add -A`,
    `git commit -m "release ${newVersion}"`,
    `git tag -a v${newVersion} -m "GraphFlow version ${newVersion}"`,
    `git push --tags`,
];

const cmd = cmds.join(" && ");

execute(cmd, "./")
    .catch(() => {
        execute("git reset --hard", "./");
    });
