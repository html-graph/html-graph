import { execute } from "./execute";

class DeployDocs {
  public static do(): void {
    const cmds = [
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

    execute(cmds.join(" && "));
  }
}

DeployDocs.do();
