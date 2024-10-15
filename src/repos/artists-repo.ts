import { db } from "../db";
import { ArtistId, ArtistUpdate, NewArtist } from "../db/schema/public/Artist";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import {
  deleteImage,
  errorResponse,
  getImage,
  handleError,
  NotFoundError,
  updateImage,
} from "../db/utils";
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
import { getUserById } from "./users-repo";
import { number } from "zod";

export async function getAllArtists() {
  try {
    return await db.selectFrom("artist").selectAll().execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistById(id: number | ArtistId) {
  try {
    const artist = await db
      .selectFrom("artist")
      .selectAll()
      .where("id", "=", id as ArtistId)
      .executeTakeFirst();

    if (!artist) {
      throw new NotFoundError(`Artist with ID ${id} does not exist`);
    }

    return artist;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function searchArtists(query: string) {}

export async function getArtistAvatar(id: number | ArtistId) {
  try {
    const existingArtist = await db
      .selectFrom("artist")
      .select("avatar_path")
      .where("id", "=", id as ArtistId)
      .executeTakeFirst();

    if (!existingArtist) {
      throw new NotFoundError(`Artist with ID ${id} does not exist`);
    }

    return await getImage("artist-avatars", existingArtist?.avatar_path);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateArtistAvatar(id: number | ArtistId, data: any) {
  try {
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
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createArtist(input: NewArtist) {
  try {
    return await db
      .insertInto("artist")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateArtist(id: number | ArtistId, input: ArtistUpdate) {
  try {
    await getArtistById(id);

    input.updated_at = new Date();

    return await db
      .updateTable("artist")
      .set(input)
      .where("id", "=", id as ArtistId)
      .returningAll()
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteArtist(id: number | ArtistId) {
  try {
    await getArtistById(id);

    return await db
      .deleteFrom("artist")
      .where("id", "=", id as ArtistId)
      .returningAll()
      .executeTakeFirst();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistProfile(id: number | ArtistId) {
  try {
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
      .where("a.id", "=", id as ArtistId)
      .executeTakeFirst();

    if (!artist) {
      throw new NotFoundError(`Artist with ID ${id} does not exist`);
    }

    return artist;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createArtistLink(input: NewArtistLink) {
  try {
    await getArtistById(input.artist);

    return await db
      .insertInto("artist_link")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateArtistLink(
  id: number | ArtistLinkId,
  input: ArtistLinkUpdate
) {
  try {
    const link = await db
      .selectFrom("artist_link")
      .select("id")
      .where("id", "=", id as ArtistLinkId)
      .executeTakeFirst();

    if (!link) {
      throw new NotFoundError(`Link with ID ${id} does not exist`);
    }

    input.updated_at = new Date();

    return await db
      .updateTable("artist_link")
      .set(input)
      .where("id", "=", id as ArtistLinkId)
      .returningAll()
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteArtistLink(id: number | ArtistLinkId) {
  try {
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
      .executeTakeFirst();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistEvents(artist: number | ArtistId) {
  try {
    getArtistById(artist);

    return await db
      .selectFrom("artist_event")
      .selectAll()
      .where("artist", "=", artist as ArtistId)
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistEventById(id: number | ArtistEventId) {
  try {
    const event = await db
      .selectFrom("artist_event")
      .selectAll()
      .where("id", "=", id as ArtistEventId)
      .executeTakeFirst();

    if (!event) {
      throw new NotFoundError(`Event with ID ${id} does not exist`);
    }

    return event;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createArtistEvent(input: NewArtistEvent) {
  try {
    await getArtistById(input.artist);

    return await db
      .insertInto("artist_event")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateArtistEvent(
  id: number | ArtistEventId,
  input: ArtistEventUpdate
) {
  try {
    await getArtistEventById(id);

    input.updated_at = new Date();

    return await db
      .updateTable("artist_event")
      .set(input)
      .where("id", "=", id as ArtistEventId)
      .returningAll()
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteArtistEvent(id: number | ArtistEventId) {
  try {
    await getArtistEventById(id);

    return await db
      .deleteFrom("artist_event")
      .where("id", "=", id as ArtistEventId)
      .returningAll()
      .executeTakeFirst();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistTags(artist: number | ArtistId) {
  try {
    await getArtistById(artist);

    return await db
      .selectFrom("artist_tag")
      .selectAll()
      .where("artist", "=", artist as ArtistId)
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistTagById(id: number | ArtistTagId) {
  try {
    const tag = await db
      .selectFrom("artist_tag")
      .selectAll()
      .where("id", "=", id as ArtistTagId)
      .executeTakeFirst();

    if (!tag) {
      throw new NotFoundError(`Tag with ID ${id} does not exist`);
    }

    return tag;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createArtistTag(input: NewArtistTag) {
  try {
    await getArtistById(input.artist);

    return await db
      .insertInto("artist_tag")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteArtistTag(id: number | ArtistTagId) {
  try {
    await getArtistTagById(id);

    return await db
      .deleteFrom("artist_tag")
      .where("id", "=", id as ArtistTagId)
      .returningAll()
      .executeTakeFirst();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistGallery(artist: number | ArtistId) {
  try {
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
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistGalleryImage(id: number | GalleryImageId) {
  try {
    const image = await db
      .selectFrom("gallery_image")
      .selectAll()
      .where("id", "=", id as GalleryImageId)
      .executeTakeFirst();

    if (!image) {
      throw new NotFoundError(`Image with ID ${id} does not exist`);
    }

    return await getImage("artist-galleries", image.path);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateArtistGalleryImage(
  data: any,
  artist: number | ArtistId,
  id?: number | GalleryImageId
) {
  try {
    await getArtistById(artist);

    if (id) await getArtistGalleryImage(id);

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
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteArtistGallery(artist: number | ArtistId) {
  try {
    await getArtistById(artist);

    const images = await db
      .selectFrom("gallery_image")
      .select("path")
      .where("artist", "=", artist as ArtistId)
      .execute();

    return await deleteImage(
      "artist-galleries",
      images.map((i) => i.path)
    );
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteArtistGalleryImage(id: number | GalleryImageId) {
  try {
    await getArtistGalleryImage(id);

    const image = await db
      .selectFrom("gallery_image")
      .select(["artist", "path"])
      .where("id", "=", id as GalleryImageId)
      .executeTakeFirst();

    return await deleteImage("artist-galleries", [image!.path]);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistValidationByArtist(artist: number | ArtistId) {
  try {
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
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getArtistValidationById(id: number | ArtistValidationId) {
  try {
    const validation = await db
      .selectFrom("artist_validation")
      .selectAll()
      .where("id", "=", id as ArtistValidationId)
      .executeTakeFirst();

    if (!validation) {
      throw new NotFoundError(`Validation with ID ${id} does not exist`);
    }
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createArtistValidation(input: NewArtistValidation) {
  try {
    await getArtistById(input.artist);
    await getUserById(input.admin);

    return await db
      .insertInto("artist_validation")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateArtistValidation(
  artist: number | ArtistId,
  input: ArtistValidationUpdate
) {
  try {
    await getArtistById(artist);

    input.updated_at = new Date() as Date;

    return await db
      .updateTable("artist_validation")
      .set(input)
      .where("artist", "=", artist as ArtistId)
      .returningAll()
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}
