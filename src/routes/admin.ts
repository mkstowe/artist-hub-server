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

  if (!dropdown) {
    c.status(404);
    return c.json({ error: "Dropdown not found" });
  }

  return c.json(dropdown);
});

admin.get("/dropdowns/label/:label", async (c) => {
  const label = c.req.param("label");

  const dropdown = await getDropdownByLabel(label);

  if (!dropdown) {
    c.status(404);
    return c.json({ error: "Dropdown not found" });
  }
  return c.json(dropdown);
});

admin.post("/dropdowns", async (c) => {
  const { category, options } = await c.req.parseBody();

  const created = await createDropdown(
    JSON.parse(category as string),
    JSON.parse(options as string)
  );

  if (!created) {
    c.status(500);
    return c.json({ error: "Failed to create dropdown" });
  }

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

  if (!updated) {
    c.status(500);
    return c.json({ error: "Failed to update dropdown" });
  }

  return c.json(updated);
});

admin.delete("/dropdowns/:id", async (c) => {
  const id = +c.req.param("id");

  const deleted = await deleteDropdown(id);
  if (!deleted) {
    c.status(500);
    return c.json({ error: "Failed to delete dropdown" });
  }

  return c.json(deleted);
});
