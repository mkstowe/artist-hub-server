// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ArtistId } from './Artist';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.artist_link */
export type ArtistLinkId = number & { __brand: 'ArtistLinkId' };

/** Represents the table public.artist_link */
export default interface ArtistLinkTable {
  id: ColumnType<ArtistLinkId, ArtistLinkId | undefined, ArtistLinkId>;

  artist: ColumnType<ArtistId, ArtistId, ArtistId>;

  url: ColumnType<string, string, string>;

  title: ColumnType<string | null, string | null, string | null>;

  index: ColumnType<number, number, number>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  updated_at: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type ArtistLink = Selectable<ArtistLinkTable>;

export type NewArtistLink = Insertable<ArtistLinkTable>;

export type ArtistLinkUpdate = Updateable<ArtistLinkTable>;
