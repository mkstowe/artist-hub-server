import { Hono } from "hono";
import {
  createFavorite,
  createUser,
  deleteFavorite,
  getUsers,
  getUserById,
  getUserAvatar,
  updateUserAvatar,
  updateUser,
  deleteUser,
} from "../repos/users-repo";
import { handleError, NotFoundError } from "../db/utils";
import { UserId } from "../db/schema/public/User";
import { ArtistId } from "../db/schema/public/Artist";

export const users = new Hono();

users.get("/", async (c) => {
  try {
    return c.json(await getUsers());
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

users.get("/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    return c.json(await getUserById(id));
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

users.post("/", async (c) => {
  try {
    const user = await createUser(await c.req.json());
    c.status(201);
    return c.json(user);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

users.patch("/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const updatedUser = await updateUser(id, await c.req.json());
    return c.json(updatedUser);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

users.delete("/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const deletedUser = await deleteUser(id);
    return c.json({ message: "User deleted" });
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

users.get("/:id/avatar", async (c) => {
  try {
    const id = +c.req.param("id");

    const { data, error } = (await getUserAvatar(id)) as {
      data: Blob;
      error: any;
    };

    if (error) {
      c.status(500);
      return c.json(error);
    }

    const arrayBuffer = await data?.arrayBuffer();

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

users.post("/:id/avatar", async (c) => {
  try {
    const id = +c.req.param("id");
    const fileData = await c.req.parseBody();
    const { data, error } = (await updateUserAvatar(id, fileData)) as {
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

users.post("/:id/favorite/:artist", async (c) => {
  try {
    const user = +c.req.param("id") as UserId;
    const artist = +c.req.param("artist") as ArtistId;

    const favorite = await createFavorite({ user, artist });
    c.status(201)
    return c.json(favorite);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

users.delete("/:id/favorite/:artist", async (c) => {
  try {
    const user = +c.req.param("id");
    const artist = +c.req.param("artist");
    const favorite = await deleteFavorite(user, artist);
    return c.json(favorite);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});
