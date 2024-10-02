import { Hono } from "hono";
import { getAllUsers } from "../repos/users-repo";

export const users = new Hono();

users.get("/", async (c) => {
  const users = await getAllUsers();
  return c.json(users);
});
