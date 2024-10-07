import { RawBuilder, sql } from "kysely";
import { supabase } from ".";

export const withTimestamps = (qb: any) => {
  return qb
    .addColumn("created_at", "timestamp", (col: any) =>
      col.defaultTo(sql`now()`).notNull()
    )
    .addColumn("updated_at", "timestamp", (col: any) =>
      col.defaultTo(sql`now()`).notNull()
    );
};

export const softDelete = (qb: any) => {
  return qb.addColumn("deleted_at", "timestamp");
};

export function json<T>(value: T, shouldStringify = false): RawBuilder<T> {
  if (shouldStringify) {
    return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
  }

  return sql`CAST(${value} AS JSONB)`;
}

export async function getImage(bucket: string, path: string) {
  const { data, error } = await supabase.storage.from(bucket).download(path);
  return { data, error };
}

export async function uploadImage(bucket: string, path: string, fileData: any) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, fileData);

  return { data, error };
}

export async function updateImage(bucket: string, path: string, fileData: any) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .update(path, fileData, { upsert: true });

  return { data, error };
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404; // Set the status code for not found
  }
}
