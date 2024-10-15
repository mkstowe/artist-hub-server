import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "../db";
import {
  DropdownCategoryId,
  NewDropdownCategory,
} from "../db/schema/public/DropdownCategory";
import {
  DropdownOptionUpdate,
  NewDropdownOption,
} from "../db/schema/public/DropdownOption";
import { errorResponse, handleError, NotFoundError } from "../db/utils";

export async function getDropdowns() {
  try {
    return await db
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

    return dropdown;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createDropdown(input: NewDropdownCategory) {
  // TODO: create category and option elements, use transaction?
}

export async function updateDropdown(
  id: number | DropdownCategoryId,
  input: any
) {
  input.options.forEach(
    (option: DropdownOptionUpdate | NewDropdownOption) => {}
  );
}

export async function deleteDropdown(id: number | DropdownCategoryId) {}
