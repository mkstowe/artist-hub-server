// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { BucketsId } from './Buckets';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for storage.s3_multipart_uploads */
export type S3MultipartUploadsId = string & { __brand: 'S3MultipartUploadsId' };

/** Represents the table storage.s3_multipart_uploads */
export default interface S3MultipartUploadsTable {
  id: ColumnType<S3MultipartUploadsId, S3MultipartUploadsId, S3MultipartUploadsId>;

  in_progress_size: ColumnType<string, string | undefined, string>;

  upload_signature: ColumnType<string, string, string>;

  bucket_id: ColumnType<BucketsId, BucketsId, BucketsId>;

  key: ColumnType<string, string, string>;

  version: ColumnType<string, string, string>;

  owner_id: ColumnType<string | null, string | null, string | null>;

  created_at: ColumnType<Date, Date | string | undefined, Date | string>;

  user_metadata: ColumnType<unknown | null, unknown | null, unknown | null>;
}

export type S3MultipartUploads = Selectable<S3MultipartUploadsTable>;

export type NewS3MultipartUploads = Insertable<S3MultipartUploadsTable>;

export type S3MultipartUploadsUpdate = Updateable<S3MultipartUploadsTable>;