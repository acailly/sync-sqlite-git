// Inspiré de https://github.com/cannadayr/git-sqlite/blob/master/src/git-sqlite-diff.in

const { exec } = require("child_process");

// for (let j = 0; j < process.argv.length; j++) {
//   console.log(j + " -> " + process.argv[j]);
// }

const newFile = process.argv[2];
const oldFile = process.argv[3];

exec(
  `sqldiff --primarykey --transaction ${oldFile} ${newFile}`,
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    console.log(stdout);
  }
);
