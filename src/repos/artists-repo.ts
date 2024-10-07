import { db } from "../db";
import { ArtistUpdate, NewArtist } from "../db/schema/public/Artist";
import { jsonObjectFrom } from "kysely/helpers/postgres";

export async function getAllArtists() {
  return await db.selectFrom("artist").selectAll().execute();
}

export async function getArtist(id: any) {
  return await db
    .selectFrom("artist")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function searchArtists(query: string) {}

export async function createArtist(input: NewArtist) {
  return await db
    .insertInto("artist")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateArtist(id: any, input: ArtistUpdate) {
  input.updated_at = new Date();

  return await db
    .updateTable("artist")
    .set(input)
    .where("id", "=", id)
    .returningAll()
    .execute();
}

export async function deleteArtist(id: any) {
  return await db
    .deleteFrom("artist")
    .where("id", "=", id)
    .returningAll()
    .execute();
}

export async function getArtistProfile(id: any) {
  return await db
    .selectFrom("artist as a")
    .selectAll()
    .select((eb) => [
      "id",
      jsonObjectFrom(
        eb
          .selectFrom("artist_link as l")
          .selectAll()
          .whereRef("l.artist", "=", "a.id")
      ).as("links"),
    ])
    .select((eb) => [
      "id",
      jsonObjectFrom(
        eb
          .selectFrom("artist_event as e")
          .selectAll()
          .whereRef("e.artist", "=", "a.id")
      ).as("events"),
    ])
    .select((eb) => [
      "id",
      jsonObjectFrom(
        eb
          .selectFrom("gallery_image as i")
          .selectAll()
          .whereRef("i.artist", "=", "a.id")
      ).as("images"),
    ])
    .where("a.id", "=", id)
    .executeTakeFirst();
}
