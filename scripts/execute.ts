import { spawn } from "child_process";

export const execute = (cmd: string): Promise<void> => {
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
};
