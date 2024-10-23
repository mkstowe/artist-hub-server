import { v4 as uuid } from "uuid";
import { db } from "../db";
import { ArtistId } from "../db/schema/public/Artist";
import { NewUser, UserId, UserUpdate } from "../db/schema/public/User";
import { NewUserFavorite } from "../db/schema/public/UserFavorite";
import {
  errorResponse,
  getImage,
  handleError,
  NotFoundError,
  updateImage,
} from "../db/utils";
import { getArtistById } from "./artists-repo";

export async function getUsers() {
  const users = await db.selectFrom("user").selectAll().execute();
  return users;
}

export async function getUserById(id: number | UserId) {
  const user = await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id as UserId)
    .executeTakeFirst();

  if (!user) {
    throw new NotFoundError(`User with ID ${id} does not exist`);
  }

  return user;
}

export async function getUserAvatar(id: number | UserId) {
  const existingUser = await db
    .selectFrom("user")
    .select("avatar_path")
    .where("id", "=", id as UserId)
    .executeTakeFirst();

  if (!existingUser) {
    throw new NotFoundError(`User with ID ${id} does not exist`);
  }

  return await getImage(
    "user-avatars",
    existingUser?.avatar_path || "demo.jpg"
  );
}

export async function updateUserAvatar(id: number | UserId, data: any) {
  const existingUser = await db
    .selectFrom("user")
    .select("avatar_path")
    .where("id", "=", id as UserId)
    .executeTakeFirst();

  if (!existingUser) {
    throw new NotFoundError(`User with ID ${id} does not exist`);
  }

  return await updateImage(
    "user-avatars",
    existingUser?.avatar_path || uuid() + ".jpg", // TODO: use the correct file extension
    data
  );
}

export async function createUser(input: NewUser) {
  const newUser = await db
    .insertInto("user")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();

  return await getUserById(newUser.id);
}

export async function updateUser(id: number | UserId, input: UserUpdate) {
  // Make sure user exists before moving forward
  await getUserById(id);

  input.updated_at = new Date();

  const updatedUser = await db
    .updateTable("user")
    .set(input)
    .where("id", "=", id as UserId)
    .returningAll()
    .executeTakeFirst();

    if (!updatedUser) {
      throw new Error("Error updating user")
    }

  return await getUserById(updatedUser.id);
}

export async function deleteUser(id: number | UserId) {
  // Make sure user exists before moving forward
  await getUserById(id);

  const deletedUser = await db
    .deleteFrom("user")
    .where("id", "=", id as UserId)
    .returningAll()
    .executeTakeFirstOrThrow();

  return deletedUser;
}

export async function getUserFavorites(user: number | UserId) {
  await getUserById(user);

  const favorites = await db.selectFrom("user_favorite").selectAll().where("user", "=", user as UserId).execute()
  return favorites;
}

export async function createFavorite(input: NewUserFavorite) {
    // Make sure these exist before moving forward
    await getUserById(input.user);
    await getArtistById(input.artist);

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
    // Make sure these exist before moving forward
    await getUserById(user);
    await getArtistById(artist);

    return await db
      .deleteFrom("user_favorite")
      .where("user", "=", user as UserId)
      .where("artist", "=", artist as ArtistId)
      .returningAll()
      .executeTakeFirstOrThrow();
}
