import { sql, type Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createType("role")
    .asEnum(["admin", "artist", "user"])
    .execute();

  await db.schema
    .createType("validation_status")
    .asEnum(["pending", "approved", "rejected"])
    .execute();

  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("first_name", "text", (col) => col.notNull())
    .addColumn("last_name", "text", (col) => col.notNull())
    .addColumn("email", "text", (col) => col.unique().notNull())
    .addColumn("active", "boolean", (col) => col.defaultTo(true).notNull())
    .addColumn("avatar_path", "text")
    .addColumn("role", sql`role`, (col) => col.defaultTo("user").notNull())
    .addColumn("auth_provider", "text")
    .addColumn("last_login", "text")
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
    .addColumn("user", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("bio", "text")
    .addColumn("avatar_path", "text")
    .addColumn("slug", "text", (col) => col.unique().notNull())
    .addColumn("active", "boolean", (col) => col.defaultTo(true).notNull())
    .addColumn("city", "text")
    .addColumn("state", "text")
    .addColumn("instagram", "text")
    .addColumn("twitter", "text")
    .addColumn("facebook", "text")
    .addColumn("website", "text")
    .addColumn("etsy", "text")
    .addColumn("phone", "text")
    .addColumn("email", "text")
    .addColumn("verified", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("adult", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("user_favorite")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("user", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("deleted_at", "text")
    .addUniqueConstraint("user_artist_unique", ["user", "artist"])
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_link")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("url", "text", (col) => col.notNull())
    .addColumn("title", "text")
    .addColumn("index", "integer", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_event")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("aratist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("starts_at", "text")
    .addColumn("ends_at", "text")
    .addColumn("location", "text")
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("gallery_image")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("path", "text", (col) => col.notNull())
    .addColumn("caption", "text")
    .addColumn("file_type", "text", (col) => col.notNull())
    .addColumn("alt_text", "text")
    .addColumn("index", "integer", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("tag")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("category")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "text", (col) => col.notNull())
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_tag")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("tag", "integer", (col) =>
      col.references("tag.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_category")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("category", "integer", (col) =>
      col.references("category.id").onDelete("cascade").notNull()
    )
    .addColumn("created_at", "text", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_validation")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("admin", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull()
    )
    .addColumn("status", sql`validation_status`, (col) =>
      col.defaultTo("pending").notNull()
    )
    .addColumn("comments", "text")
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
  await db.schema.dropTable("artist_validation").cascade().ifExists().execute();
  await db.schema.dropTable("artist_category").cascade().ifExists().execute();
  await db.schema.dropTable("artist_tag").cascade().ifExists().execute();
  await db.schema.dropTable("category").cascade().ifExists().execute();
  await db.schema.dropTable("tag").cascade().ifExists().execute();
  await db.schema.dropTable("gallery_image").cascade().ifExists().execute();
  await db.schema.dropTable("artist_event").cascade().ifExists().execute();
  await db.schema.dropTable("artist_link").cascade().ifExists().execute();
  await db.schema.dropTable("user_favorite").cascade().ifExists().execute();
  await db.schema.dropTable("artist").cascade().ifExists().execute();
  await db.schema.dropTable("user").cascade().ifExists().execute();
  await db.schema.dropType("role").ifExists().execute();
  await db.schema.dropType("validation_status").ifExists().execute();
}
