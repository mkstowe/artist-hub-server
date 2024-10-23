import { Hono } from "hono";
import {
  createArtist,
  createArtistEvent,
  createArtistLink,
  createArtistTag,
  createArtistValidation,
  deleteArtist,
  deleteArtistEvent,
  deleteArtistGalleryImage,
  deleteArtistLink,
  deleteArtistTag,
  getAllArtists,
  getArtistAvatar,
  getArtistById,
  getArtistEventById,
  getArtistEvents,
  getArtistGallery,
  getArtistGalleryImage,
  getArtistProfile,
  getArtistTagById,
  getArtistTags,
  updateArtist,
  updateArtistAvatar,
  updateArtistEvent,
  updateArtistGalleryImage,
  updateArtistLink,
  updateArtistValidation,
} from "../repos/artists-repo";
import { handleError, NotFoundError } from "../db/utils";

export const artists = new Hono();

artists.get("/", async (c) => {
  try {
    const artists = await getAllArtists();
    return c.json(artists);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const artist = await getArtistById(id);
    return c.json(artist);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:id/full", async (c) => {
  try {
    const id = +c.req.param("id");
    const artist = await getArtistProfile(id);
    return c.json(artist);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.post("/", async (c) => {
  try {
    const artist = await createArtist(await c.req.json());
    c.status(201);
    return c.json(artist);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.patch("/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const updatedArtist = updateArtist(id, await c.req.json());
    return c.json(updatedArtist);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.delete("/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const artist = await deleteArtist(id);
    return c.json({ message: "Artist deleted" });
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/search", async (c) => {
  return c.text("Not implemented");
});

artists.get("/:id/avatar", async (c) => {
  try {
    const id = +c.req.param("id");
    const { data, error } = (await getArtistAvatar(id)) as {
      data: Blob;
      error: any;
    };

    if (error) {
      c.status(500);
      return c.json(error);
    }

    const arrayBuffer = await data.arrayBuffer();

    let encoded = "";
    if (arrayBuffer) {
      encoded = Buffer.from(arrayBuffer).toString("base64");
    }

    c.header("Content-Type", data?.type);
    return c.json({ data: encoded });
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.post("/:id/avatar", async (c) => {
  try {
    const id = +c.req.param("id");
    const fileData = await c.req.parseBody();
    const { data, error } = (await updateArtistAvatar(id, fileData)) as {
      data: any;
      error: any;
    };

    if (error) {
      c.status(500);
      return c.json(error);
    }

    return c.json(data);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.post("/:artist/link", async (c) => {
  try {
    const link = await createArtistLink(await c.req.json());
    c.status(201);
    return c.json(link);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.patch("/:artist/link/:id", async (c) => {
  try {
    const id = +c.req.param("id")!;
    const link = await updateArtistLink(id, await c.req.json());
    return c.json(link);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.delete("/:artist/link/:id", async (c) => {
  try {
    const id = +c.req.param("id")!;
    const link = await deleteArtistLink(id);
    return c.json(link);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:artist/events", async (c) => {
  try {
    const artist = +c.req.param("artist");
    const events = await getArtistEvents(artist);
    return c.json(events);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:artist/events/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const event = await getArtistEventById(id);
    return c.json(event);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.post("/:artist/event", async (c) => {
  try {
    const event = await createArtistEvent(await c.req.json());
    c.status(201);
    return c.json(event);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.patch("/:artist/event/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const event = await updateArtistEvent(id, await c.req.json());
    return c.json(event);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.delete("/:artist/event/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const event = await deleteArtistEvent(id);
    return c.json(event);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:artist/tags", async (c) => {
  try {
    const artist = +c.req.param("artist");
    const tags = await getArtistTags(artist);
    return c.json(tags);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:artist/tags/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const tag = await getArtistTagById(id);
    return c.json(tag);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.post("/:artist/tag", async (c) => {
  try {
    const tag = await createArtistTag(await c.req.json());
    c.status(201);
    return c.json(tag);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.delete("/:artist/tag/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const tag = await deleteArtistTag(id);
    return c.json(tag);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:artist/gallery", async (c) => {
  try {
    const artist = +c.req.param("artist");
    const gallery = await getArtistGallery(artist);
    return c.json(gallery);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.get("/:artist/gallery/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const gallery = await getArtistGalleryImage(id);
    return c.json(gallery);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.patch(":artist/gallery/:id", async (c) => {
  try {
    const artist = +c.req.param("artist");
    const id = +c.req.param("id");
    const gallery = await updateArtistGalleryImage(
      await c.req.parseBody(),
      artist,
      id
    );
    return c.json(gallery);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.delete("/:artist/gallery/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const gallery = await deleteArtistGalleryImage(id);
    return c.json(gallery);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.post("/:artist/validate", async (c) => {
  try {
    const artist = +c.req.param("artist");
    const validated = await createArtistValidation(await c.req.json());
    c.status(201);
    return c.json(validated);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

artists.patch(":artist/validate/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const validated = await updateArtistValidation(id, await c.req.json());
    return c.json(validated);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});
