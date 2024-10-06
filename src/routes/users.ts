import { Hono } from "hono";
import {
  createUser,
  getAllUsers,
  getUser,
  getUserAvatar,
} from "../repos/users-repo";

export const users = new Hono();

users.get("/", async (c) => {
  const users = await getAllUsers();
  return c.json(users);
});

users.get("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUser(id);

  if (!user) {
    c.status(404);
    return c.json({ error: "User not found" });
  }

  return c.json(user);
});

users.get("/:id/avatar", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await getUserAvatar(id);

  if (error) {
    c.status(500);
    return c.json(error);
  }

  c.header("Content-Type", data?.type);
  return c.json(await data?.arrayBuffer());
});

users.post("/", async (c) => {
  const user = await createUser(await c.req.json());
  return c.json(user);
});

users.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUser(id);
  if (!user) {
    c.status(404);
    return c.json({ error: "User not found" });
  }
  const updatedUser = await c.req.json();
  return c.json(updatedUser);
});

users.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const user = await getUser(id);
  if (!user) {
    c.status(404);
    return c.json({ error: "User not found" });
  }
  return c.json({ message: "User deleted" });
});
