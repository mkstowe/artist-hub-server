import { db } from "../db";
import { ArtistId, ArtistUpdate, NewArtist } from "../db/schema/public/Artist";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { deleteImage, getImage, NotFoundError, updateImage } from "../db/utils";
import { v4 as uuid } from "uuid";
import {
  ArtistLinkId,
  ArtistLinkUpdate,
  NewArtistLink,
} from "../db/schema/public/ArtistLink";
import {
  ArtistEventId,
  ArtistEventUpdate,
  NewArtistEvent,
} from "../db/schema/public/ArtistEvent";
import { ArtistTagId, NewArtistTag } from "../db/schema/public/ArtistTag";
import {
  GalleryImageId,
  GalleryImageUpdate,
} from "../db/schema/public/GalleryImage";
import {
  ArtistValidationId,
  ArtistValidationUpdate,
  NewArtistValidation,
} from "../db/schema/public/ArtistValidation";

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

export async function getArtistAvatar(id: number | ArtistId) {
  const artist = await getArtistById(id);

  if (!artist) {
    throw new NotFoundError(`Artist with ID ${id} does not exist`);
  }

  return await getImage("artist-avatars", artist?.avatar_path);
}

export async function updateArtistAvatar(id: number | ArtistId, data: any) {
  const artist = await getArtistById(id);

  if (!artist) {
    throw new NotFoundError(`Artist with ID ${id} does not exist`);
  }

  return await updateImage(
    "artist-avatars",
    artist?.avatar_path || uuid() + ".jpg", // TODO: get file extension from data
    data
  );
}

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
    .executeTakeFirst();
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

export async function createArtistLink(input: NewArtistLink) {
  return await db
    .insertInto("artist_link")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateArtistLink(
  id: number | ArtistLinkId,
  input: ArtistLinkUpdate
) {
  return await db
    .updateTable("artist_link")
    .set(input)
    .where("id", "=", id as ArtistLinkId)
    .returningAll()
    .execute();
}

export async function deleteArtistLink(id: number | ArtistLinkId) {
  return await db
    .deleteFrom("artist_link")
    .where("id", "=", id as ArtistLinkId)
    .returningAll()
    .executeTakeFirst();
}

export async function getArtistEvents(artist: number | ArtistId) {
  return await db
    .selectFrom("artist_event")
    .selectAll()
    .where("artist", "=", artist as ArtistId)
    .execute();
}

export async function getArtistEventById(id: number | ArtistEventId) {
  return await db
    .selectFrom("artist_event")
    .selectAll()
    .where("id", "=", id as ArtistEventId)
    .executeTakeFirst();
}

export async function createArtistEvent(input: NewArtistEvent) {
  return await db
    .insertInto("artist_event")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateArtistEvent(
  id: number | ArtistEventId,
  input: ArtistEventUpdate
) {
  return await db
    .updateTable("artist_event")
    .set(input)
    .where("id", "=", id as ArtistEventId)
    .returningAll()
    .execute();
}

export async function deleteArtistEvent(id: number | ArtistEventId) {
  return await db
    .deleteFrom("artist_event")
    .where("id", "=", id as ArtistEventId)
    .returningAll()
    .executeTakeFirst();
}

export async function getArtistTags(artist: number | ArtistId) {
  return await db
    .selectFrom("artist_tag")
    .selectAll()
    .where("artist", "=", artist as ArtistId)
    .execute();
}

export async function getArtistTagById(id: number | ArtistTagId) {
  return await db
    .selectFrom("artist_tag")
    .selectAll()
    .where("id", "=", id as ArtistTagId)
    .executeTakeFirst();
}

export async function createArtistTag(input: NewArtistTag) {
  return await db
    .insertInto("artist_tag")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteArtistTag(id: number | ArtistTagId) {
  return await db
    .deleteFrom("artist_tag")
    .where("id", "=", id as ArtistTagId)
    .returningAll()
    .executeTakeFirst();
}

export async function getArtistGallery(artist: number | ArtistId) {
  const imageObjects = await db
    .selectFrom("gallery_image")
    .selectAll()
    .where("artist", "=", artist as ArtistId)
    .execute();

  const images: { data: Blob; error: any }[] = [];
  imageObjects.forEach(async (i) => {
    images.push(await getImage("artist-galleries", i.path));
  });

  return images;
}

export async function getArtistGalleryImage(id: number | GalleryImageId) {
  const image = await db
    .selectFrom("gallery_image")
    .selectAll()
    .where("id", "=", id as GalleryImageId)
    .executeTakeFirst();

  if (!image) {
    throw new NotFoundError("Image not found");
  }

  return await getImage("artist-galleries", image.path);
}

export async function updateArtistGalleryImage(
  data: any,
  artist: number | ArtistId,
  id?: number | GalleryImageId
) {
  const image = await db
    .selectFrom("gallery_image")
    .select("path")
    .where("id", "=", id as GalleryImageId)
    .executeTakeFirst();

  return await updateImage(
    "artist-galleries",
    image?.path || artist + "/" + uuid() + ".jpg",
    data
  ); // TODO: get file type
}

export async function deleteArtistGallery(artist: number | ArtistId) {
  const images = await db
    .selectFrom("gallery_image")
    .select("path")
    .where("artist", "=", artist as ArtistId)
    .execute();

  return await deleteImage(
    "artist-galleries",
    images.map((i) => i.path)
  );
}

export async function deleteArtistGalleryImage(id: number | GalleryImageId) {
  const image = await db
    .selectFrom("gallery_image")
    .select(["artist", "path"])
    .where("id", "=", id as GalleryImageId)
    .executeTakeFirst();

  if (!image) {
    throw new NotFoundError("Image not found");
  }

  return await deleteImage("artist-galleries", [image.path]);
}

export async function createArtistValidation(input: NewArtistValidation) {
  return await db
    .insertInto("artist_validation")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateArtistValidation(
  id: number | ArtistValidationId,
  input: ArtistValidationUpdate
) {
  return await db
    .updateTable("artist_validation")
    .set(input)
    .where("id", "=", id as ArtistValidationId)
    .returningAll()
    .execute();
}
