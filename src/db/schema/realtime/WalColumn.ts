// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable } from 'kysely';

/** Represents the compositeType realtime.wal_column */
export default interface WalColumnTable {
  name: ColumnType<string | null, never, never>;

  type_name: ColumnType<string | null, never, never>;

  type_oid: ColumnType<unknown | null, never, never>;

  value: ColumnType<unknown | null, never, never>;

  is_pkey: ColumnType<boolean | null, never, never>;

  is_selectable: ColumnType<boolean | null, never, never>;
}

export type WalColumn = Selectable<WalColumnTable>;
