import { db } from "../db";
import { ArtistId, ArtistUpdate, NewArtist } from "../db/schema/public/Artist";
import { jsonArrayFrom } from "kysely/helpers/postgres";

export async function getAllArtists() {
  return await db.selectFrom("artist").selectAll().execute();
}

export async function getArtistById(id: number | ArtistId) {
  return await db
    .selectFrom("artist")
    .selectAll()
    .where("id", "=", id as ArtistId)
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

export async function updateArtist(id: number | ArtistId, input: ArtistUpdate) {
  input.updated_at = new Date();

  return await db
    .updateTable("artist")
    .set(input)
    .where("id", "=", id as ArtistId)
    .returningAll()
    .execute();
}

export async function deleteArtist(id: number | ArtistId) {
  return await db
    .deleteFrom("artist")
    .where("id", "=", id as ArtistId)
    .returningAll()
    .execute();
}

export async function getArtistProfile(id: number | ArtistId) {
  return await db
    .selectFrom("artist as a")
    .selectAll()
    .select((eb) => [
      "id",
      jsonArrayFrom(
        eb
          .selectFrom("artist_link as l")
          .selectAll()
          .whereRef("l.artist", "=", "a.id")
      ).as("links"),
    ])
    .select((eb) => [
      "id",
      jsonArrayFrom(
        eb
          .selectFrom("artist_event as e")
          .selectAll()
          .whereRef("e.artist", "=", "a.id")
      ).as("events"),
    ])
    .select((eb) => [
      "id",
      jsonArrayFrom(
        eb
          .selectFrom("gallery_image as i")
          .selectAll()
          .whereRef("i.artist", "=", "a.id")
      ).as("images"),
    ])
    .where("a.id", "=", id as ArtistId)
    .executeTakeFirst();
}
