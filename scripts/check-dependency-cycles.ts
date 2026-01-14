import { readFileSync } from "fs";
import { exit } from "process";

class CheckDependencyCycles {
  public static do(): void {
    const content = readFileSync("./deps-graph/deps-graph.dot", "utf8");

    if (/xlabel="no-circular"/.test(content)) {
      exit(1);
    }
  }
}

CheckDependencyCycles.do();
