import { Hono } from "hono";
import { getDropdownById, getDropdowns } from "../repos/admin-repo";

export const admin = new Hono();

admin.get("/dropdowns", async (c) => {
  return c.json(await getDropdowns());
});

admin.get("/dropdowns/:id", async (c) => {
  const id = +c.req.param("id");
  return c.json(await getDropdownById(id));
});
