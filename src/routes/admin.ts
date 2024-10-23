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
import { handleError } from "@/db/utils";

export const admin = new Hono();

admin.get("/dropdowns", async (c) => {
  try {
    return c.json(await getDropdowns());
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

admin.get("/dropdowns/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const dropdown = await getDropdownById(id);
    return c.json(dropdown);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

admin.get("/dropdowns/label/:label", async (c) => {
  try {
    const label = c.req.param("label");
    const dropdown = await getDropdownByLabel(label);
    return c.json(dropdown);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

admin.post("/dropdowns", async (c) => {
  try {
    const { category, options } = await c.req.parseBody();
    const created = await createDropdown(
      JSON.parse(category as string),
      JSON.parse(options as string)
    );
    return c.json(created);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

admin.patch("/dropdowns/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const { category, options } = await c.req.parseBody();

    const updated = await updateDropdown(
      id,
      JSON.parse(category as string),
      JSON.parse(options as string)
    );

    return c.json(updated);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});

admin.delete("/dropdowns/:id", async (c) => {
  try {
    const id = +c.req.param("id");
    const deleted = await deleteDropdown(id);
    return c.json(deleted);
  } catch (error) {
    const result = handleError(error);
    c.status(result.status);
    return c.json(result.message);
  }
});
