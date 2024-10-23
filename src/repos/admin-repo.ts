import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "../db";
import {
  DropdownCategoryId,
  NewDropdownCategory,
  DropdownCategory,
  DropdownCategoryUpdate,
} from "../db/schema/public/DropdownCategory";
import {
  DropdownOptionUpdate,
  NewDropdownOption,
} from "../db/schema/public/DropdownOption";
import {
  errorResponse,
  handleError,
  NotFoundError,
  successResponse,
} from "../db/utils";

export async function getDropdownCategories() {
  const categories = await db
    .selectFrom("dropdown_category")
    .selectAll()
    .execute();
  return categories;
}

export async function getDropdownCategoryById(id: number | DropdownCategoryId) {
  const category = await db
    .selectFrom("dropdown_category")
    .selectAll()
    .where("id", "=", id as DropdownCategoryId)
    .executeTakeFirst();

  if (!category) {
    throw new NotFoundError(`Category with ID ${id} does not exist`);
  }

  return category;
}

export async function getDropdownCategoryByLabel(label: string) {
  const category = await db
    .selectFrom("dropdown_category")
    .selectAll()
    .where("label", "=", label)
    .executeTakeFirst();

  if (!category) {
    throw new NotFoundError(`Category with label ${label} does not exist`);
  }

  return category;
}

export async function getDropdowns() {
  const dropdowns = await db
    .selectFrom("dropdown_category as c")
    .selectAll()
    .select((eb) => [
      "id",
      jsonArrayFrom(
        eb
          .selectFrom("dropdown_option as o")
          .selectAll()
          .whereRef("o.category", "=", "c.id")
      ).as("options"),
    ])
    .execute();

  return dropdowns;
}

export async function getDropdownById(id: number | DropdownCategoryId) {
  const dropdown = await db
    .selectFrom("dropdown_category as c")
    .selectAll()
    .select((eb) => [
      "id",
      jsonArrayFrom(
        eb
          .selectFrom("dropdown_option as o")
          .selectAll()
          .whereRef("o.category", "=", "c.id")
      ).as("options"),
    ])
    .where("c.id", "=", id as DropdownCategoryId)
    .executeTakeFirst();

  if (!dropdown) {
    throw new NotFoundError(`Category with ID ${id} does not exist`);
  }

  return dropdown;
}

export async function getDropdownByLabel(label: string) {
  const dropdown = await db
    .selectFrom("dropdown_category as c")
    .selectAll()
    .select((eb) => [
      "id",
      jsonArrayFrom(
        eb
          .selectFrom("dropdown_option as o")
          .selectAll()
          .whereRef("o.category", "=", "c.id")
      ).as("options"),
    ])
    .where("c.label", "=", label)
    .executeTakeFirst();

  if (!dropdown) {
    throw new NotFoundError(`Category with label ${label} does not exist`);
  }

  return dropdown;
}

export async function createDropdown(
  category: NewDropdownCategory,
  options: Partial<NewDropdownOption>[]
) {
  options.map((o) => {
    if (!o.label || !o.index || !o.value) {
      throw new Error("Missing required fields for dropdown option");
    }
  });

  let newCategoryId: number | undefined;
  await db.transaction().execute(async (trx) => {
    const newCategory = await trx
      .insertInto("dropdown_category")
      .values(category)
      .returningAll()
      .executeTakeFirstOrThrow();

    newCategoryId = newCategory.id;

    await Promise.all(
      options.map(async (o) => {
        o.category = newCategory.id;
        await trx
          .insertInto("dropdown_option")
          .values(o as NewDropdownOption)
          .executeTakeFirstOrThrow();
      })
    );
  });

  return await getDropdownById(newCategoryId as DropdownCategoryId);
}

export async function updateDropdown(
  categoryId: number | DropdownCategoryId,
  category: DropdownCategoryUpdate,
  options: Partial<NewDropdownOption>[]
) {
  const existingCategory = await getDropdownCategoryById(categoryId);
  category.updated_at = new Date();
  await db.transaction().execute(async (trx) => {
    const updatedCategory = await trx
      .updateTable("dropdown_category")
      .set(category)
      .where("id", "=", existingCategory!.id)
      .returningAll()
      .executeTakeFirst();

    await db
      .deleteFrom("dropdown_option")
      .where("category", "=", existingCategory!.id)
      .execute();

    await Promise.all(
      options.map(async (o) => {
        o.category = updatedCategory!.id;

        await trx
          .insertInto("dropdown_option")
          .values(o as NewDropdownOption)
          .execute();
      })
    );
  });

  return await getDropdownById(categoryId);
}

export async function deleteDropdown(id: number | DropdownCategoryId) {
  await getDropdownCategoryById(id);
  const deleted = await db
    .deleteFrom("dropdown_category")
    .returningAll()
    .where("id", "=", id as DropdownCategoryId)
    .executeTakeFirstOrThrow();

  return deleted;
}
