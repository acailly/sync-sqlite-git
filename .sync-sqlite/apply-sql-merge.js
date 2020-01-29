const fs = require("fs");
const { execSync } = require("child_process");

// for (let j = 0; j < process.argv.length; j++) {
//   console.log(j + " -> " + process.argv[j]);
// }

const mergeFileExtension = ".merge.sql";

let mergeFile = process.argv[2];
let originalFile;
if (mergeFile.endsWith(mergeFileExtension)) {
  originalFile = mergeFile.substring(
    0,
    mergeFile.length - mergeFileExtension.length
  );
} else {
  originalFile = mergeFile;
  mergeFile = `${mergeFile}${mergeFileExtension}`;
}

execSync(`sqlite3 ${originalFile} < ${mergeFile}`);
fs.unlinkSync(mergeFile);
execSync(`git add ${originalFile}`);
