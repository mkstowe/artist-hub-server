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
    .createTable("dropdown_category")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("label", "text", (col) => col.notNull())
    .addColumn("active", "boolean", (col) => col.defaultTo(true).notNull())
    .addColumn("index", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint("dropdown_category_index_unique", ["index"])
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("dropdown_option")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("category", "integer", (col) =>
      col.references("dropdown_category.id").onDelete("cascade").notNull()
    )
    .addColumn("value", "text", (col) => col.notNull())
    .addColumn("label", "text", (col) => col.notNull())
    .addColumn("active", "boolean", (col) => col.defaultTo(true).notNull())
    .addColumn("index", "integer", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint("dropdown_option_category_index_unique", [
      "category",
      "index",
    ])
    .ifNotExists()
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
    .addColumn("last_login", "timestamp")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
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
    .addColumn("category", "integer", (col) =>
      col.references("dropdown_option.id").onDelete("cascade").notNull()
    )
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
    .addColumn("validation_status", sql`validation_status`, (col) =>
      col.defaultTo("pending").notNull()
    )
    .addColumn("adult", "boolean", (col) => col.defaultTo(false).notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
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
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("deleted_at", "timestamp")
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
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint("artist_link_artist_index_unique", ["artist", "index"])
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_event")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("title", "text", (col) => col.notNull())
    .addColumn("description", "text")
    .addColumn("start_date", "timestamp")
    .addColumn("end_date", "timestamp")
    .addColumn("location", "text")
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
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
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint("gallery_image_artist_index_unique", [
      "artist",
      "index",
    ])
    .ifNotExists()
    .execute();

  await db.schema
    .createTable("artist_tag")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("artist", "integer", (col) =>
      col.references("artist.id").onDelete("cascade").notNull()
    )
    .addColumn("tag", "text", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addUniqueConstraint("artist_tag_unique", ["artist", "tag"])
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
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("validated_at", "timestamp")
    .ifNotExists()
    .execute();

  await db.schema
    .createIndex("user_email_idx")
    .on("user")
    .columns(["email"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("user_role_idx")
    .on("user")
    .columns(["role"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_slug_idx")
    .on("artist")
    .columns(["slug"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_user_idx")
    .on("artist")
    .columns(["user"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_verified_idx")
    .on("artist")
    .columns(["verified"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_category_idx")
    .on("artist")
    .columns(["category"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("user_favorite_user_idx")
    .on("user_favorite")
    .columns(["user"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("user_favorite_artist_idx")
    .on("user_favorite")
    .columns(["artist"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("user_favorite_user_artist_idx")
    .on("user_favorite")
    .columns(["user", "artist"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_event_artist_idx")
    .on("artist_event")
    .columns(["artist"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_event_start_date_idx")
    .on("artist_event")
    .columns(["start_date"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_event_end_date_idx")
    .on("artist_event")
    .columns(["end_date"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_link_artist_idx")
    .on("artist_link")
    .columns(["artist"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("gallery_image_artist_idx")
    .on("gallery_image")
    .columns(["artist"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_tag_artist_idx")
    .on("artist_tag")
    .columns(["artist"])
    .ifNotExists()
    .execute();
  await db.schema
    .createIndex("artist_tag_tag_idx")
    .on("artist_tag")
    .columns(["tag"])
    .ifNotExists()
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("artist_validation").cascade().ifExists().execute();
  await db.schema.dropTable("artist_tag").cascade().ifExists().execute();
  await db.schema.dropTable("category").cascade().ifExists().execute();
  await db.schema.dropTable("gallery_image").cascade().ifExists().execute();
  await db.schema.dropTable("artist_event").cascade().ifExists().execute();
  await db.schema.dropTable("artist_link").cascade().ifExists().execute();
  await db.schema.dropTable("user_favorite").cascade().ifExists().execute();
  await db.schema.dropTable("artist").cascade().ifExists().execute();
  await db.schema.dropTable("user").cascade().ifExists().execute();
  await db.schema.dropTable("dropdown_option").cascade().ifExists().execute();
  await db.schema.dropTable("dropdown_category").cascade().ifExists().execute();

  await db.schema.dropType("role").ifExists().execute();
  await db.schema.dropType("validation_status").ifExists().execute();

  await db.schema.dropIndex("user_email_idx").ifExists().execute();
  await db.schema.dropIndex("user_role_idx").ifExists().execute();
  await db.schema.dropIndex("artist_slug_idx").ifExists().execute();
  await db.schema.dropIndex("artist_user_idx").ifExists().execute();
  await db.schema.dropIndex("artist_verified_idx").ifExists().execute();
  await db.schema.dropIndex("user_favorite_user_idx").ifExists().execute();
  await db.schema.dropIndex("user_favorite_artist_idx").ifExists().execute();
  await db.schema
    .dropIndex("user_favorite_user_artist_idx")
    .ifExists()
    .execute();
  await db.schema.dropIndex("artist_event_artist_idx").ifExists().execute();
  await db.schema.dropIndex("artist_event_start_date_idx").ifExists().execute();
  await db.schema.dropIndex("artist_event_end_date_idx").ifExists().execute();
  await db.schema.dropIndex("artist_link_artist_idx").ifExists().execute();
  await db.schema.dropIndex("gallery_image_artist_idx").ifExists().execute();
  await db.schema.dropIndex("artist_tag_artist_idx").ifExists().execute();
  await db.schema.dropIndex("artist_tag_tag_idx").ifExists().execute();
  await db.schema.dropIndex("artist_category_idx").ifExists().execute();
}
