const path = require("path");
const { execSync } = require("child_process");

// for (let j = 0; j < process.argv.length; j++) {
//   console.log(j + " -> " + process.argv[j]);
// }

const [nodeExecutable, scriptName, command, ...params] = process.argv;

const commandDirectory = path.dirname(scriptName);
const commandFile = path.join(commandDirectory, `${command}.js`);

try {
  execSync(`"${nodeExecutable}" "${commandFile}" ${params.join(" ")}`, {
    stdio: "inherit"
  });
} catch (e) {
  process.exit(1);
}
