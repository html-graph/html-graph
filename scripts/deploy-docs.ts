import { spawn } from "child_process";

class DeployDocs {
  public static do(): void {
    const cmdsBeforePublish = [
      "npm install",
      "npm run build-docs",
      "cd ..",
      "git clone git@github.com:html-graph/html-graph.github.io.git || true",
      "cd ./html-graph.github.io",
      "git pull --rebase",
      "rm -rdf ./**",
      "cp -r ../html-graph/dist-docs/** .",
      "git add -A",
      'git commit -m "docs deploy" || true',
      "git push",
    ];

    this.execute(cmdsBeforePublish.join(" && "));
  }

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
}

DeployDocs.do();
