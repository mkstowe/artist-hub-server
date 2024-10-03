import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("bio", "text")
    .addColumn("created_by", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("artist").cascade().ifExists().execute();
  await db.schema.dropTable("user").cascade().ifExists().execute();
}
