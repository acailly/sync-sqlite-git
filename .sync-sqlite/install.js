// Inspired from https://github.com/cannadayr/git-sqlite/blob/master/src/git-sqlite.in

const fs = require("fs");
const { execSync } = require("child_process");

// add diff section
execSync(`git config diff.sqlite.binary "true"`);
execSync(`git config diff.sqlite.command "node .sync-sqlite/cli.js diff"`);

// add merge section
execSync(`git config merge.sqlite.name "sqlite merge"`);
execSync(
  `git config merge.sqlite.driver "node .sync-sqlite/cli.js merge %O %A %B %L %P"`
);

// add git show-sql alias
execSync(`git config alias.show-sql "show --ext-diff -m"`);

// add git apply-sql alias
execSync(
  `git config alias.apply-sql-merge "!node .sync-sqlite/cli.js apply-sql-merge" #`
);

// modify local .gitattributes
const attributes = "*.sqlite diff=sqlite merge=sqlite";
execSync(`echo ${attributes} >> ".gitattributes"`);
