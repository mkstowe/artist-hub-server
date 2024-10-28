import { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";
import { v4 as uuid } from "uuid";
import { db } from "../db";
import { ArtistId, ArtistUpdate, NewArtist } from "../db/schema/public/Artist";
import {
  ArtistEventId,
  ArtistEventUpdate,
  NewArtistEvent,
} from "../db/schema/public/ArtistEvent";
import {
  ArtistLinkId,
  ArtistLinkUpdate,
  NewArtistLink,
} from "../db/schema/public/ArtistLink";
import { ArtistTagId, NewArtistTag } from "../db/schema/public/ArtistTag";
import {
  ArtistValidationId,
  ArtistValidationUpdate,
  NewArtistValidation,
} from "../db/schema/public/ArtistValidation";
import { GalleryImageId } from "../db/schema/public/GalleryImage";
import { deleteImage, getImage, NotFoundError, updateImage } from "../db/utils";
import { getUserById } from "./users-repo";

export async function getArtists() {
  return await db
    .selectFrom("artist as a")
    .selectAll()
    .select((eb) => [
      "id",
      jsonObjectFrom(
        eb
          .selectFrom("dropdown_option as o")
          .selectAll()
          .whereRef("a.category", "=", "o.id")
      ).as("category_object"),
    ])
    .execute();
}

export async function getArtistById(id: number | ArtistId) {
  const artist = await db
    .selectFrom("artist as a")
    .selectAll()
    .select((eb) => [
      "id",
      jsonObjectFrom(
        eb
          .selectFrom("dropdown_option as o")
          .selectAll()
          .whereRef("a.category", "=", "o.id")
      ).as("category_object"),
    ])

    .where("id", "=", id as ArtistId)
    .executeTakeFirst();

  if (!artist) {
    throw new NotFoundError(`Artist with ID ${id} does not exist`);
  }

  return artist;
}

export async function searchArtists(query: string) {
  // TODO: searchArtists
}

export async function getArtistAvatar(id: number | ArtistId) {
  const existingArtist = await db
    .selectFrom("artist")
    .select("avatar_path")
    .where("id", "=", id as ArtistId)
    .executeTakeFirst();

  if (!existingArtist) {
    throw new NotFoundError(`Artist with ID ${id} does not exist`);
  }

  return await getImage("artist-avatars", existingArtist?.avatar_path);
}

export async function updateArtistAvatar(id: number | ArtistId, data: any) {
  const existingArtist = await db
    .selectFrom("artist")
    .select("avatar_path")
    .where("id", "=", id as ArtistId)
    .executeTakeFirst();

  if (!existingArtist) {
    throw new NotFoundError(`Artist with ID ${id} does not exist`);
  }

  return await updateImage(
    "artist-avatars",
    existingArtist?.avatar_path || uuid() + ".jpg", // TODO: get file extension from data
    data
  );
}

export async function createArtist(
  input: NewArtist,
  links: Partial<NewArtistLink>[]
) {
  let newArtistId: number | undefined;
  await db.transaction().execute(async (trx) => {
    const newArtist = await db
      .insertInto("artist")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();

    newArtistId = newArtist.id;
    await Promise.all(
      links.map(async (l) => {
        l.artist = newArtist.id;
        await trx
          .insertInto("artist_link")
          .values(l as NewArtistLink)
          .executeTakeFirstOrThrow();
      })
    );
  });

  return await getArtistProfile(newArtistId as ArtistId);
}

export async function updateArtist(
  id: number | ArtistId,
  input: ArtistUpdate,
  links: Partial<NewArtistLink>[]
) {
  const existingArtist = await getArtistById(id);
  input.updated_at = new Date();

  await db.transaction().execute(async (trx) => {
    const updatedArtist = await db
      .updateTable("artist")
      .set(input)
      .where("id", "=", id as ArtistId)
      .returningAll()
      .executeTakeFirst();

    if (!updatedArtist) {
      throw new Error("Error updating artist");
    }

    await db
      .deleteFrom("artist_link")
      .where("artist", "=", existingArtist.id)
      .execute();

    await Promise.all(
      links.map(async (l) => {
        l.artist = updatedArtist.id;

        await trx
          .insertInto("artist_link")
          .values(l as NewArtistLink)
          .execute();
      })
    );
  });

  return getArtistProfile(existingArtist.id);
}

export async function deleteArtist(id: number | ArtistId) {
  await getArtistById(id);

  return await db
    .deleteFrom("artist")
    .where("id", "=", id as ArtistId)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getArtistProfile(id: number | ArtistId) {
  const artist = await db
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
    .select((eb) => [
      "id",
      jsonObjectFrom(
        eb
          .selectFrom("dropdown_option as o")
          .selectAll()
          .whereRef("a.category", "=", "o.id")
      ).as("category_object"),
    ])
    .where("a.id", "=", id as ArtistId)
    .executeTakeFirst();

  if (!artist) {
    throw new NotFoundError(`Artist with ID ${id} does not exist`);
  }

  return artist;
}

export async function createArtistLink(input: NewArtistLink) {
  await getArtistById(input.artist);

  const createdLink = await db
    .insertInto("artist_link")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();

  if (!createdLink) {
    throw new Error("Error creating artist link");
  }

  return createdLink;
}

export async function updateArtistLink(
  id: number | ArtistLinkId,
  input: ArtistLinkUpdate
) {
  const link = await db
    .selectFrom("artist_link")
    .select("id")
    .where("id", "=", id as ArtistLinkId)
    .executeTakeFirst();

  if (!link) {
    throw new NotFoundError(`Link with ID ${id} does not exist`);
  }

  input.updated_at = new Date();

  const created = await db
    .updateTable("artist_link")
    .set(input)
    .where("id", "=", id as ArtistLinkId)
    .returningAll()
    .executeTakeFirst();

  if (!created) {
    throw new Error("Error creating artist link");
  }

  return created;
}

export async function deleteArtistLink(id: number | ArtistLinkId) {
  const link = await db
    .selectFrom("artist_link")
    .select("id")
    .where("id", "=", id as ArtistLinkId)
    .executeTakeFirst();

  if (!link) {
    throw new NotFoundError(`Link with ID ${id} does not exist`);
  }

  return await db
    .deleteFrom("artist_link")
    .where("id", "=", id as ArtistLinkId)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function getArtistEvents(artist: number | ArtistId) {
  getArtistById(artist);

  return await db
    .selectFrom("artist_event")
    .selectAll()
    .where("artist", "=", artist as ArtistId)
    .execute();
}

export async function getArtistEventById(id: number | ArtistEventId) {
  const event = await db
    .selectFrom("artist_event")
    .selectAll()
    .where("id", "=", id as ArtistEventId)
    .executeTakeFirst();

  if (!event) {
    throw new NotFoundError(`Event with ID ${id} does not exist`);
  }

  return event;
}

export async function createArtistEvent(input: NewArtistEvent) {
  await getArtistById(input.artist);

  const createdEvent = await db
    .insertInto("artist_event")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();

  if (!createdEvent) {
    throw new Error("Error creating event");
  }

  return getArtistEventById(createdEvent.id);
}

export async function updateArtistEvent(
  id: number | ArtistEventId,
  input: ArtistEventUpdate
) {
  await getArtistEventById(id);

  input.updated_at = new Date();

  const updatedEvent = await db
    .updateTable("artist_event")
    .set(input)
    .where("id", "=", id as ArtistEventId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedEvent) {
    throw new Error("Error updating event");
  }

  return getArtistEventById(updatedEvent.id);
}

export async function deleteArtistEvent(id: number | ArtistEventId) {
  await getArtistEventById(id);

  const deletedEvent = await db
    .deleteFrom("artist_event")
    .where("id", "=", id as ArtistEventId)
    .returningAll()
    .executeTakeFirst();

  if (!deletedEvent) {
    throw new Error("Error deleting event");
  }

  return deletedEvent;
}

export async function getArtistTags(artist: number | ArtistId) {
  await getArtistById(artist);

  return await db
    .selectFrom("artist_tag")
    .selectAll()
    .where("artist", "=", artist as ArtistId)
    .execute();
}

export async function getArtistTagById(id: number | ArtistTagId) {
  const tag = await db
    .selectFrom("artist_tag")
    .selectAll()
    .where("id", "=", id as ArtistTagId)
    .executeTakeFirst();

  if (!tag) {
    throw new NotFoundError(`Tag with ID ${id} does not exist`);
  }

  return tag;
}

export async function createArtistTag(input: NewArtistTag) {
  await getArtistById(input.artist);

  const createdTag = await db
    .insertInto("artist_tag")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();

  if (!createdTag) {
    throw new Error("Error creating tag");
  }

  return getArtistTagById(createdTag.id);
}

export async function deleteArtistTag(id: number | ArtistTagId) {
  await getArtistTagById(id);

  const deletedTag = await db
    .deleteFrom("artist_tag")
    .where("id", "=", id as ArtistTagId)
    .returningAll()
    .executeTakeFirst();

  if (!deletedTag) {
    throw new Error("Error deleting tag");
  }

  return deletedTag;
}

export async function getArtistGallery(artist: number | ArtistId) {
  await getArtistById(artist);

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
    throw new NotFoundError(`Image with ID ${id} does not exist`);
  }

  return await getImage("artist-galleries", image.path);
}

export async function updateArtistGalleryImage(
  data: any,
  artist: number | ArtistId,
  id?: number | GalleryImageId
) {
  await getArtistById(artist);

  if (id) await getArtistGalleryImage(id);

  const image = await db
    .selectFrom("gallery_image")
    .select("path")
    .where("id", "=", id as GalleryImageId)
    .executeTakeFirst();

  if (!image) {
    throw new NotFoundError(`Image with ID ${id} does not exist`);
  }

  const updatedImage = await updateImage(
    "artist-galleries",
    image.path || artist + "/" + uuid() + ".jpg",
    data
  ); // TODO: get file type

  if (!updatedImage) {
    throw new Error("Error updating image");
  }

  return updatedImage;
}

export async function deleteArtistGallery(artist: number | ArtistId) {
  await getArtistById(artist);

  const images = await db
    .selectFrom("gallery_image")
    .select("path")
    .where("artist", "=", artist as ArtistId)
    .execute();

  const deletedImages = await deleteImage(
    "artist-galleries",
    images.map((i) => i.path)
  );

  return deletedImages;
}

export async function deleteArtistGalleryImage(id: number | GalleryImageId) {
  await getArtistGalleryImage(id);

  const image = await db
    .selectFrom("gallery_image")
    .select(["artist", "path"])
    .where("id", "=", id as GalleryImageId)
    .executeTakeFirst();

  if (!image) {
    throw new NotFoundError(`Image with ID ${id} not found`);
  }

  const deletedImage = await deleteImage("artist-galleries", [image!.path]);

  if (!deletedImage) {
    throw new Error("Error deleting image");
  }

  return deletedImage;
}

export async function getArtistValidationByArtist(artist: number | ArtistId) {
  await getArtistById(artist);

  const validation = await db
    .selectFrom("artist_validation")
    .selectAll()
    .where("artist", "=", artist as ArtistId)
    .executeTakeFirst();

  if (!validation) {
    throw new NotFoundError(
      `Validation for artist with ID ${artist} does not exist`
    );
  }

  return validation;
}

export async function getArtistValidationById(id: number | ArtistValidationId) {
  const validation = await db
    .selectFrom("artist_validation")
    .selectAll()
    .where("id", "=", id as ArtistValidationId)
    .executeTakeFirst();

  if (!validation) {
    throw new NotFoundError(`Validation with ID ${id} does not exist`);
  }

  return validation;
}

export async function createArtistValidation(input: NewArtistValidation) {
  await getArtistById(input.artist);
  await getUserById(input.admin);

  const createdValidation = await db
    .insertInto("artist_validation")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();

  if (!createdValidation) {
    throw new Error("Error creating validation");
  }

  return getArtistValidationById(createdValidation.id);
}

export async function updateArtistValidation(
  artist: number | ArtistId,
  input: ArtistValidationUpdate
) {
  await getArtistById(artist);

  input.updated_at = new Date() as Date;

  const updatedValidation = await db
    .updateTable("artist_validation")
    .set(input)
    .where("artist", "=", artist as ArtistId)
    .returningAll()
    .executeTakeFirst();

  if (!updatedValidation) {
    throw new Error("Error updating validation");
  }

  return getArtistValidationById(updatedValidation.id);
}
