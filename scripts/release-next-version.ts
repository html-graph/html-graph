import { spawn } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import readline from "readline";
import { stdin as input, stdout as output } from "process";

class Releaser {
  private static execute(cmd: string): Promise<void> {
    return new Promise((res, rej) => {
      const proc = spawn(cmd, [], {
        cwd: "./",
        shell: true,
      });

      proc.stderr.setEncoding("utf-8");
      proc.stdout.pipe(process.stdout);
      proc.stderr.pipe(process.stderr);

      proc.on("close", (code) => {
        if (code === 0) {
          res();
        } else {
          rej();
        }
      });
    });
  }

  private static askCode(): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({ input, output });

      rl.question("Ready for publishing! Enter OTP code: ", (answer) => {
        resolve(answer);

        rl.close();
      });
    });
  }

  static release(): void {
    const content = readFileSync("./package.json", "utf8");

    const pkg = JSON.parse(content);

    const version = pkg.version;

    const reg = /(\d+)\.(\d+)\.(\d+)/;

    const result = version.match(reg);

    const major = parseInt(result[1]);
    const minor = parseInt(result[2]);
    const patch = parseInt(result[3]);

    const args = process.argv.slice(2);
    const isMajor = args.includes("--major");
    const isMinor = args.includes("--minor");

    let newVersion = `${major}.${minor}.${patch + 1}`;

    if (isMinor) {
      newVersion = `${major}.${minor + 1}.0`;
    }

    if (isMajor) {
      newVersion = `${major + 1}.0.0`;
    }

    pkg.version = newVersion;

    const newContent = JSON.stringify(pkg, null, 2);

    writeFileSync("./package.json", newContent);

    const cmdsBeforePublish = [
      `npx prettier ./package.json --write`,
      `npm install`,
      "npm run prebuild",
      "npm run build",
    ];

    const cmdsAfterPublish = [
      `git add -A`,
      `git commit -m "release ${newVersion}"`,
      `git tag -a v${newVersion} -m "new version ${newVersion}"`,
      `git push`,
      `git push --tags`,
    ];

    this.execute(cmdsBeforePublish.join(" && "))
      .then(() => this.askCode())
      .then((otp) => this.execute(`npm publish --access=public --otp=${otp}`))
      .then(() => this.execute(cmdsAfterPublish.join(" && ")))
      .catch(() => this.execute("git reset --hard"));
  }
}

Releaser.release();
