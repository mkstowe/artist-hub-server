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
  try {
    const categories = await db
      .selectFrom("dropdown_category")
      .selectAll()
      .execute();
    return successResponse(categories, 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getDropdownCategoryById(id: number | DropdownCategoryId) {
  try {
    const category = await db
      .selectFrom("dropdown_category")
      .selectAll()
      .where("id", "=", id as DropdownCategoryId)
      .executeTakeFirst();

    if (!category) {
      throw new NotFoundError(`Category with ID ${id} does not exist`);
    }

    // return successResponse(category, 200);
    return category;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getDropdownCategoryByLabel(label: string) {
  try {
    const category = await db
      .selectFrom("dropdown_category")
      .selectAll()
      .where("label", "=", label)
      .executeTakeFirst();

    if (!category) {
      throw new NotFoundError(`Category with label ${label} does not exist`);
    }

    return successResponse(category, 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getDropdowns() {
  try {
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

    return successResponse(dropdowns, 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getDropdownById(id: number | DropdownCategoryId) {
  try {
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
      .execute();

    if (!dropdown) {
      throw new NotFoundError(`Category with ID ${id} does not exist`);
    }

    return successResponse(dropdown, 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getDropdownByLabel(label: string) {
  try {
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
      .execute();

    if (!dropdown) {
      throw new NotFoundError(`Category with label ${label} does not exist`);
    }

    return successResponse(dropdown, 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createDropdown(
  category: NewDropdownCategory,
  options: Partial<NewDropdownOption>[]
) {
  options.map((o => {
    if (!o.label || !o.index || !o.value) {
      throw new Error("Missing required fields for dropdown option")
    }
  }))

  try {
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

    return successResponse(
      await getDropdownById(newCategoryId as DropdownCategoryId),
      201
    );
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateDropdown(
  categoryId: number | DropdownCategoryId,
  category: DropdownCategoryUpdate,
  options: (DropdownOptionUpdate | NewDropdownOption)[]
) {
  try {
    const existingCategory = (await getDropdownCategoryById(
      categoryId
    )) as DropdownCategory;
    await db.transaction().execute(async (trx) => {
      const updatedCategory = await trx
        .updateTable("dropdown_category")
        .set(category)
        .where("id", "=", existingCategory.id)
        .returningAll()
        .executeTakeFirstOrThrow();

      await Promise.all(
        options.map(async (o) => {
          o.category = updatedCategory.id;

          if (o.id) {
            await trx
              .updateTable("dropdown_option")
              .set(o as DropdownOptionUpdate)
              .where("id", "=", o.id)
              .execute();
          } else {
            await trx
              .insertInto("dropdown_option")
              .values(o as NewDropdownOption)
              .executeTakeFirstOrThrow();
          }
        })
      );
    });

    return successResponse(await getDropdownById(categoryId), 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteDropdown(id: number | DropdownCategoryId) {
  try {
    await getDropdownCategoryById(id);
    const deleted = await db
      .deleteFrom("dropdown_category")
      .returningAll()
      .where("id", "=", id as DropdownCategoryId)
      .execute();

    return successResponse(deleted, 200);
  } catch (error) {
    return errorResponse(handleError(error));
  }
}
