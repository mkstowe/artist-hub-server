// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.dropdown_category */
export type DropdownCategoryId = number & { __brand: 'DropdownCategoryId' };

/** Represents the table public.dropdown_category */
export default interface DropdownCategoryTable {
  id: ColumnType<DropdownCategoryId, DropdownCategoryId | undefined, DropdownCategoryId>;

  label: ColumnType<string, string, string>;

  active: ColumnType<boolean, boolean | undefined, boolean>;

  index: ColumnType<number, number, number>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type DropdownCategory = Selectable<DropdownCategoryTable>;

export type NewDropdownCategory = Insertable<DropdownCategoryTable>;

export type DropdownCategoryUpdate = Updateable<DropdownCategoryTable>;