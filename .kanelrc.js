const { makeKyselyHook } = require("kanel-kysely");

require("dotenv").config();

module.exports = {
  connection: process.env.DATABASE_URL,

  preDeleteOutputFolder: true,
  outputPath: "./src/db/schema",

  preRenderHooks: [makeKyselyHook()],
};