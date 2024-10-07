// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { default as Role } from './Role';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.user */
export type UserId = number & { __brand: 'UserId' };

/** Represents the table public.user */
export default interface UserTable {
  id: ColumnType<UserId, UserId | undefined, UserId>;

  first_name: ColumnType<string, string, string>;

  last_name: ColumnType<string, string, string>;

  email: ColumnType<string, string, string>;

  active: ColumnType<boolean, boolean | undefined, boolean>;

  avatar_path: ColumnType<string | null, string | null, string | null>;

  role: ColumnType<Role, Role | undefined, Role>;

  auth_provider: ColumnType<string | null, string | null, string | null>;

  last_login: ColumnType<Date | null, Date | string | null, Date | string | null>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type User = Selectable<UserTable>;

export type NewUser = Insertable<UserTable>;

export type UserUpdate = Updateable<UserTable>;
