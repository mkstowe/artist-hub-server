import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("role")
    .asEnum(["admin", "artist", "user"])
    .execute();

  await db.schema
    .alterTable("user")
    .addColumn("role", sql`role`, (col) => col.defaultTo("user").notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("user").cascade().ifExists().execute();
  await db.schema.dropType("role").ifExists().execute();
}
