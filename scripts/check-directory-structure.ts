import { readFileSync } from "fs";
import { exit } from "process";

class CheckDirectoryStructure {
  public static do(): void {
    const content = readFileSync("./deps-graph/deps-graph.dot", "utf8");

    if (/xlabel="no-circular"/.test(content)) {
      exit(1);
    }
  }
}

CheckDirectoryStructure.do();
