import { jsonArrayFrom } from "kysely/helpers/postgres";
import { db } from "../db";
import {
  DropdownCategoryId,
  NewDropdownCategory,
} from "../db/schema/public/DropdownCategory";

export async function getDropdowns() {
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
}

export async function getDropdownById(id: number | DropdownCategoryId) {
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
    .where("c.id", "=", id as DropdownCategoryId)
    .execute();
}

export async function createDropdown(input: NewDropdownCategory) {}

export async function updateDropdown(
  id: number | DropdownCategoryId,
  input: NewDropdownCategory
) {}

export async function deleteDropdown(id: number | DropdownCategoryId) {}
