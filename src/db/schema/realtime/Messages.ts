// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for realtime.messages */
export type MessagesId = string & { __brand: 'MessagesId' };

/** Represents the table realtime.messages */
export default interface MessagesTable {
  id: ColumnType<MessagesId, MessagesId | undefined, MessagesId>;

  topic: ColumnType<string, string, string>;

  extension: ColumnType<string, string, string>;

  inserted_at: ColumnType<Date, Date | string, Date | string>;

  updated_at: ColumnType<Date, Date | string, Date | string>;
}

export type Messages = Selectable<MessagesTable>;

export type NewMessages = Insertable<MessagesTable>;

export type MessagesUpdate = Updateable<MessagesTable>;