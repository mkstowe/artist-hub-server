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
import { NotFoundError } from "../db/utils";

export const artists = new Hono();

artists.get("/", async (c) => {
  const artists = await getAllArtists();
  return c.json(artists);
});

artists.get("/:id", async (c) => {
  const id = +c.req.param("id");
  const artist = await getArtistById(id);

  if (!artist) {
    c.status(404);
    return c.json({ error: "Artist not found" });
  }

  return c.json(artist);
});

artists.get("/:id/full", async (c) => {
  const id = +c.req.param("id");
  const artist = await getArtistProfile(id);

  if (!artist) {
    c.status(404);
    return c.json({ error: "Artist not found" });
  }

  return c.json(artist);
});

artists.post("/", async (c) => {
  const artist = await createArtist(await c.req.json());
  if (!artist) {
    c.status(500);
    return c.json({ error: "Failed to create artist" });
  }
  return c.json(artist);
});

artists.patch("/:id", async (c) => {
  const id = +c.req.param("id");
  const updatedArtist = updateArtist(id, await c.req.json());
  if (!updatedArtist) {
    c.status(500);
    return c.json({ error: "Failed to update artist" });
  }
  return c.json(updatedArtist);
});

artists.delete("/:id", async (c) => {
  const id = +c.req.param("id");
  const artist = await deleteArtist(id);
  if (!artist) {
    c.status(500);
    return c.json({ error: "Failed to delete artist" });
  }
  return c.json({ message: "Artist deleted" });
});

artists.get("/search", async (c) => {
  return c.text("Not implemented");
});

artists.get("/:id/avatar", async (c) => {
  const id = +c.req.param("id");

  try {
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
    if (error instanceof NotFoundError) {
      c.status(404);
      return c.json({ error: error.message });
    }
  }
});

artists.post("/:id/avatar", async (c) => {
  const id = +c.req.param("id");
  const fileData = await c.req.parseBody();

  try {
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
    if (error instanceof NotFoundError) {
      c.status(404);
      return c.json({ error: error.message });
    }
  }
});

artists.post("/:artist/link", async (c) => {
  const link = await createArtistLink(await c.req.json());
  return c.json(link);
});

artists.patch("/:artist/link/:id", async (c) => {
  const id = +c.req.param("id")!;
  const link = await updateArtistLink(id, await c.req.json());
  return c.json(link);
});

artists.delete("/:artist/link/:id", async (c) => {
  const id = +c.req.param("id")!;
  const link = await deleteArtistLink(id);
  return c.json(link);
});

artists.get("/:artist/events", async (c) => {
  const artist = +c.req.param("artist");
  const events = await getArtistEvents(artist);
  return c.json(events);
});

artists.get("/:artist/events/:id", async (c) => {
  const id = +c.req.param("id");
  const event = await getArtistEventById(id);
  return c.json(event);
});

artists.post("/:artist/event", async (c) => {
  const event = await createArtistEvent(await c.req.json());
  return c.json(event);
});

artists.patch("/:artist/event/:id", async (c) => {
  const id = +c.req.param("id");
  const event = await updateArtistEvent(id, await c.req.json());
  return c.json(event);
});

artists.delete("/:artist/event/:id", async (c) => {
  const id = +c.req.param("id");
  const event = await deleteArtistEvent(id);
  return c.json(event);
});

artists.get("/:artist/tags", async (c) => {
  const artist = +c.req.param("artist");
  const tags = await getArtistTags(artist);
  return c.json(tags);
});

artists.get("/:artist/tags/:id", async (c) => {
  const id = +c.req.param("id");
  const tag = await getArtistTagById(id);
  return c.json(tag);
});

artists.post("/:artist/tag", async (c) => {
  const tag = await createArtistTag(await c.req.json());
  return c.json(tag);
});

artists.delete("/:artist/tag/:id", async (c) => {
  const id = +c.req.param("id");
  const tag = await deleteArtistTag(id);
  return c.json(tag);
});

artists.get("/:artist/gallery", async (c) => {
  const artist = +c.req.param("artist");
  const gallery = await getArtistGallery(artist);
  return c.json(gallery);
});

artists.get("/:artist/gallery/:id", async (c) => {
  const id = +c.req.param("id");
  const gallery = await getArtistGalleryImage(id);
  return c.json(gallery);
});

artists.patch(":artist/gallery/:id", async (c) => {
  const artist = +c.req.param("artist");
  const id = +c.req.param("id");
  const gallery = await updateArtistGalleryImage(
    await c.req.parseBody(),
    artist,
    id
  );
  return c.json(gallery);
});

artists.delete("/:artist/gallery/:id", async (c) => {
  const id = +c.req.param("id");
  const gallery = await deleteArtistGalleryImage(id);
  return c.json(gallery);
});

artists.post("/:artist/validate", async (c) => {
  const artist = +c.req.param("artist");
  const validated = await createArtistValidation(await c.req.json());
  return c.json(validated);
});

artists.patch(":artist/validate/:id", async (c) => {
  const id = +c.req.param("id");
  const validated = await updateArtistValidation(id, await c.req.json());
  return c.json(validated);
});
