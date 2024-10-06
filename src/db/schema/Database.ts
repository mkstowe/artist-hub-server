// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { default as AuthSchema } from './auth/AuthSchema';
import type { default as StorageSchema } from './storage/StorageSchema';
import type { default as VaultSchema } from './vault/VaultSchema';
import type { default as PublicSchema } from './public/PublicSchema';
import type { default as RealtimeSchema } from './realtime/RealtimeSchema';

type Database = AuthSchema & StorageSchema & VaultSchema & PublicSchema & RealtimeSchema;

export default Database;
