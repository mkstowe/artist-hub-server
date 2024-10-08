import { Hono } from "hono";
import {
  createFavorite,
  createUser,
  deleteFavorite,
  getAllUsers,
  getUserById,
  getUserAvatar,
  updateUserAvatar,
} from "../repos/users-repo";
import { NotFoundError } from "../db/utils";

export const users = new Hono();

users.get("/", async (c) => {
  const users = await getAllUsers();
  return c.json(users);
});

users.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUserById(id);

  if (!user) {
    c.status(404);
    return c.json({ error: "User not found" });
  }

  return c.json(user);
});

users.post("/", async (c) => {
  const user = await createUser(await c.req.json());
  return c.json(user);
});

users.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUserById(id);
  if (!user) {
    c.status(404);
    return c.json({ error: "User not found" });
  }
  const updatedUser = await c.req.json();
  return c.json(updatedUser);
});

users.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUserById(id);
  if (!user) {
    c.status(404);
    return c.json({ error: "User not found" });
  }
  return c.json({ message: "User deleted" });
});

users.get("/:id/avatar", async (c) => {
  const id = c.req.param("id");

  try {
    const { data, error } = await getUserAvatar(id);

    if (error) {
      c.status(500);
      return c.json(error);
    }

    
    const arrayBuffer = await data?.arrayBuffer();
    
    let encoded = ''
    if (arrayBuffer) {
      encoded = Buffer.from(arrayBuffer).toString('base64');
    }
    
    c.header("Content-Type", data?.type);
    return c.json({data: encoded});
  } catch (error) {
    if (error instanceof NotFoundError) {
      c.status(404);
      return c.json({ error: error.message });
    }
  }
});

users.post("/:id/avatar", async (c) => {
  const id = c.req.param("id");
  const fileData = await c.req.parseBody();

  try {
    const { data, error } = await updateUserAvatar(id, fileData);

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

users.post("/:id/favorite/:artist", async (c) => {
  const user: any = c.req.param("id");
  const artist: any = +c.req.param("artist");

  const favorite = await createFavorite({ user, artist });
  return c.json(favorite);
});

users.delete("/:id/favorite/:artist", async (c) => {
  const user: any = c.req.param("id");
  const artist: any = +c.req.param("artist");
  const favorite = await deleteFavorite(user, artist);
  return c.json(favorite);
});
