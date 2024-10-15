import { Hono } from "hono";
import {
  createDropdown,
  deleteDropdown,
  getDropdownById,
  getDropdownByLabel,
  getDropdownCategoryById,
  getDropdowns,
  updateDropdown,
} from "../repos/admin-repo";

export const admin = new Hono();

admin.get("/dropdowns", async (c) => {
  return c.json(await getDropdowns());
});

admin.get("/dropdowns/:id", async (c) => {
  const id = +c.req.param("id");
  const dropdown = await getDropdownById(id);
  return c.json(await getDropdownById(id));
});

admin.get("/dropdowns/label/:label", async (c) => {
  const label = c.req.param("label");
  return c.json(await getDropdownByLabel(label));
});

admin.post("/dropdowns", async (c) => {
  const { category, options } = await c.req.parseBody();

  const created = await createDropdown(
    JSON.parse(category as string),
    JSON.parse(options as string)
  );

  return c.json(created);
});

admin.patch("/dropdowns/:id", async (c) => {
  const id = +c.req.param("id");
  const { category, options } = await c.req.parseBody();

  const updated = await updateDropdown(
    id,
    JSON.parse(category as string),
    JSON.parse(options as string)
  );
  return c.json(updated);
});

admin.delete("/dropdowns/:id", async (c) => {
  const id = +c.req.param("id");
  const deleted = await deleteDropdown(id);
  return c.json(deleted);
});
