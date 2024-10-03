import { FileMigrationProvider, Migrator } from "kysely";
import { promises as fs } from "fs";

import { db } from ".";
import path = require("path");
import { run } from "kysely-migration-cli";

const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: path.join(__dirname, "./migrations"),
  }),
});

run(db, migrator, "./src/db/migrations");
