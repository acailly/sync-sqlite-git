# sync-sqlite-git
Custom merge handler for SQLite files in Git

## Usage

### Get the scripts

In your repo:

```bash
git clone <this_repo> .sync-sqlite
rm -rf .sync-sqlite/.git
```

### Install the custom handlers

```bash
node .\.sync-sqlite\install.js
```

This should append the following content in the .gitattributes file (and create that file if needed):

```
*.sqlite diff=sqlite merge=sqlite
```

This should also edit your config file: 

```bash
git config -l
> ...
> diff.sqlite.binary=true
> diff.sqlite.command=node .sync-sqlite/cli.js diff
> merge.sqlite.name=sqlite merge
> merge.sqlite.driver=node .sync-sqlite/cli.js merge %O %A %B %L %P
> alias.show-sql=show --ext-diff -m
> alias.apply-sql-merge=!node .sync-sqlite/cli.js apply-sql-merge
```

### How it works?

When a change is detected in a .sqlite file, the custom handler will try to resolve the conflict automatically.

It uses the sqldiff tool internally (<https://www.sqlite.org/sqldiff.html>).

If the conflict is resolved successfully, you don't have anything to do.

If the conflict is not resolved, you have to resolve them manually (see the following section).

### Resolve conflicts manually

When there is a conflict, a file that ends with `.merge.sql` is created:

```sql
BEGIN TRANSACTION;
UPDATE Posts SET content='Hello world...
<<<<<<< local2remote.txt
... with Alice' WHERE id=2;
=======
... from Bob' WHERE id=2;
>>>>>>> remote2local.txt
COMMIT;
```

Resolve it as an usual merge conflict and instead of using `git add` once the conflict is resolved, use:

```bash
git apply-sql-merge your_sqlite_file.sqlite.merge.sql
```

Then commit to end the merge operation, as usual.

### Bonus : git show command with fancier output for .sqlite files

```bash
git show-sql
```

```sql
commit 8344589b7499d83733e3a96d64910c207c9ab3f1 (HEAD -> master)
Author: acailly <xxx@xxx.com>
Date:   Mon Jan 20 22:32:02 2020 +0100

    Modif Alice ligne 1

BEGIN TRANSACTION;
UPDATE Posts SET content='Modified content' WHERE id=1;
COMMIT;
```

## Thanks

This project is basically an adaptation of <https://github.com/cannadayr/git-sqlite> in Node

