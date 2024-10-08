import { db } from "../db";
import { ArtistId } from "../db/schema/public/Artist";
import { NewUser, UserId, UserUpdate } from "../db/schema/public/User";
import { NewUserFavorite } from "../db/schema/public/UserFavorite";
import { getImage, NotFoundError, updateImage } from "../db/utils";
import { v4 as uuid } from "uuid";

export async function getAllUsers() {
  return await db.selectFrom("user").selectAll().execute();
}

export async function getUserById(id: number | UserId) {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id as UserId)
    .executeTakeFirst();
}

export async function getUserAvatar(id: number | UserId) {
  const user = await db
    .selectFrom("user")
    .select("avatar_path")
    .where("id", "=", id as UserId)
    .executeTakeFirst();

  if (!user) {
    throw new NotFoundError(`User with ID ${id} does not exist`);
  }

  return getImage("user-avatars", user?.avatar_path || "demo.jpg");
}

export async function updateUserAvatar(id: number | UserId, data: any) {
  const user = await db
    .selectFrom("user")
    .select("avatar_path")
    .where("id", "=", id as UserId)
    .executeTakeFirst();

  if (!user) {
    throw new NotFoundError(`User with ID ${id} does not exist`);
  }

  return updateImage(
    "user-avatars",
    user?.avatar_path || uuid() + ".jpg", // TODO: use the correct file extension
    data
  );
}

export async function createUser(input: NewUser) {
  return await db
    .insertInto("user")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateUser(id: number | UserId, input: UserUpdate) {
  input.updated_at = new Date();

  return await db
    .updateTable("user")
    .set(input)
    .where("id", "=", id as UserId)
    .returningAll()
    .execute();
}

export async function deleteUser(id: number | UserId) {
  return await db
    .deleteFrom("user")
    .where("id", "=", id as UserId)
    .returningAll()
    .executeTakeFirst();
}

export async function createFavorite(input: NewUserFavorite) {
  return await db
    .insertInto("user_favorite")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function deleteFavorite(
  user: number | UserId,
  artist: number | ArtistId
) {
  return await db
    .deleteFrom("user_favorite")
    .where("user", "=", user as UserId)
    .where("artist", "=", artist as ArtistId)
    .returningAll()
    .executeTakeFirst();
}
