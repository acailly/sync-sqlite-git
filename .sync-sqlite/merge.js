// Inspired from https://github.com/cannadayr/git-sqlite/blob/master/src/git-sqlite-merge.in

const fs = require("fs");
const { execSync } = require("child_process");

// for (let j = 0; j < process.argv.length; j++) {
//   console.log(j + " -> " + process.argv[j]);
// }

const ancestor = process.argv[2];
const localDb = process.argv[3];
const remote = process.argv[4];
const marker = process.argv[5];
const placeholder = process.argv[6];

const diffDbWithoutTransaction = "sqldiff --primarykey";
const diffDbWithTransaction = `${diffDbWithoutTransaction} --transaction`;

// get the diffs from the common ancestor to our states
const ancestor2localDiff = "ancestor2local.txt";
execSync(
  `${diffDbWithTransaction} "${ancestor}" "${localDb}" > "${ancestor2localDiff}"`
);
const ancestor2remoteDiff = "ancestor2remote.txt";
execSync(
  `${diffDbWithTransaction} "${ancestor}" "${remote}" > "${ancestor2remoteDiff}"`
);

// backup the localDb before merging
const backupDb = `${localDb}.bak`;
fs.copyFileSync(localDb, backupDb);

// apply each diff to its counterpart
execSync(`sqlite3 "${localDb}" < "${ancestor2remoteDiff}"`);
execSync(`sqlite3 "${remote}" < "${ancestor2localDiff}"`);

// diff our db's again
const local2remote = "local2remote.txt";
execSync(
  `${diffDbWithTransaction} "${localDb}" "${remote}" > "${local2remote}"`
);
const remote2local = "remote2local.txt";
execSync(
  `${diffDbWithTransaction} "${remote}" "${localDb}" > "${remote2local}"`
);

// diff the diff files
let gitDiff;
try {
  gitDiff = execSync(`git diff --no-index "${local2remote}" "${remote2local}"`);
} catch (e) {
  gitDiff = e.stdout;
}

if (gitDiff && gitDiff.toString("utf8")) {
  // generate the merge conflict file
  const emptyFile = "empty.txt";
  fs.writeFileSync(emptyFile, "");
  const mergeFile = `${placeholder}.merge.sql`;
  try {
    execSync(
      `git merge-file -p "${local2remote}" "${emptyFile}" "${remote2local}" > "${mergeFile}"`
    );
  } catch (e) {
    // Do nothing
  }

  // restore the backup
  fs.copyFileSync(backupDb, localDb);

  // exit the script
  fs.unlinkSync(emptyFile);
  clean();
  process.exit(1);
}

// apply the diff
execSync(`sqlite3 "${localDb}" < "${ancestor2remoteDiff}"`);

clean();

function clean() {
  fs.unlinkSync(ancestor2localDiff);
  fs.unlinkSync(ancestor2remoteDiff);
  fs.unlinkSync(local2remote);
  fs.unlinkSync(remote2local);
  fs.unlinkSync(backupDb);
}
