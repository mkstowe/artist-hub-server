import { RawBuilder, sql } from "kysely";
import { supabase } from ".";
import { DatabaseError } from "pg";

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

export async function getImage(bucket: string, path: string | null) {
  if (!path) {
    throw new NotFoundError("Image not found");
  }

  const { data, error } = await supabase.storage.from(bucket).download(path);

  if (!data) {
    throw new NotFoundError("Image not found");
  }

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

export async function deleteImage(bucket: string, paths: string[]) {
  const { data, error } = await supabase.storage.from(bucket).remove(paths);

  return { data, error };
}

export class NotFoundError extends Error {
  statusCode: number;
  constructor(message: string) {
    super(message);
    this.statusCode = 404; // Set the status code for not found
  }
}

// EXAMPLE: logError('Error while fetching data', error)
export function logError(message: string, error: any) {
  console.error(`[ERROR] ${error.statusCode}: ${message}\n`);
}

// EXAMPLE: logInfo('User logged in', { userId: 123, username: 'john_doe' })
export function logInfo(message: string, data?: any) {
  console.info(`[INFO] ${message}\n`, data || "");
}

export function handleError(error: any) {
  logError(error.message, error);

  if (error instanceof NotFoundError) {
    return { status: error.statusCode, message: error.message };
  }

  if (error instanceof DatabaseError) {
    if (error.message.includes("unique constraint")) {
      return { status: 409, message: "Resource already exists" };
    }
  }

  return { status: 500, message: "An unexpected error occurred" };
}

// EXAMPLE: successResponse({ userId: 123, username: 'john_doe' })
export function successResponse(data: any, statusCode: number = 200) {
  return {
    statusCode,
    body: JSON.stringify({ error: false, data }),
  };
}

// EXAMPLE: errorResponse(error.message, error.statusCode || 500)
export function errorResponse(data: { message: string; status: number }) {
  return {
    statusCode: data.status || 500,
    body: JSON.stringify({
      error: true,
      message: data.message,
    }),
  };
}
