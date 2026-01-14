import { readFileSync, writeFileSync } from "fs";
import readline from "readline";
import { stdin, stdout } from "process";
import { execute } from "./execute";

class ReleaseNextVersion {
  public static async do(): Promise<void> {
    await execute(
      `if [ "$(git rev-parse --abbrev-ref HEAD)" != "master" ]; then exit 1; fi`,
    );

    const cmdsBeforeBuild = [
      "npm install",
      "npm run before-build",
      "npm run check-dependency-cycles",
    ];

    await execute(cmdsBeforeBuild.join(" && "));

    const newVersion = this.updateVersion();

    const cmdsBuild = ["npx prettier ./package.json --write", "npm run build"];

    await execute(cmdsBuild.join(" && "));

    const cmdsBeforePublish = [
      "git add -A",
      `git commit -m "release ${newVersion}"`,
      `git tag -a v${newVersion} -m "new version ${newVersion}"`,
      "git push",
      "git push --tags",
      "git push gitverse master",
      "git push --tags gitverse master",
    ];

    await execute(cmdsBeforePublish.join(" && "));

    const otp = await this.askCode();

    await execute(`npm publish --access=public --otp=${otp}`);
  }

  private static askCode(): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({ input: stdin, output: stdout });

      rl.question("Ready for publishing! Enter OTP code: ", (answer) => {
        resolve(answer);

        rl.close();
      });
    });
  }

  private static updateVersion(): string {
    const content = readFileSync("./package.json", "utf8");

    const pkg = JSON.parse(content);

    const version = pkg.version;

    const reg = /^(\d+)\.(\d+)\.(\d+)$/;

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

    return newVersion;
  }
}

ReleaseNextVersion.do();
