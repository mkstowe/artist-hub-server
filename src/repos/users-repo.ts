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

export async function getAllUsers() {
  try {
    return await db.selectFrom("user").selectAll().execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getUserById(id: number | UserId) {
  try {
    const user = await db
      .selectFrom("user")
      .selectAll()
      .where("id", "=", id as UserId)
      .executeTakeFirst();

    if (!user) {
      throw new NotFoundError(`User with ID ${id} does not exist`);
    }

    return user;
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function getUserAvatar(id: number | UserId) {
  try {
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
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateUserAvatar(id: number | UserId, data: any) {
  try {
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
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createUser(input: NewUser) {
  try {
    return await db
      .insertInto("user")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function updateUser(id: number | UserId, input: UserUpdate) {
  try {
    // Make sure user exists before moving forward
    await getUserById(id);

    input.updated_at = new Date();

    return await db
      .updateTable("user")
      .set(input)
      .where("id", "=", id as UserId)
      .returningAll()
      .execute();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteUser(id: number | UserId) {
  try {
    // Make sure user exists before moving forward
    await getUserById(id);

    return await db
      .deleteFrom("user")
      .where("id", "=", id as UserId)
      .returningAll()
      .executeTakeFirst();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function createFavorite(input: NewUserFavorite) {
  try {
    // Make sure these exist before moving forward
    await getUserById(input.user);
    await getArtistById(input.artist);

    return await db
      .insertInto("user_favorite")
      .values(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}

export async function deleteFavorite(
  user: number | UserId,
  artist: number | ArtistId
) {
  try {
    // Make sure these exist before moving forward
    await getUserById(user);
    await getArtistById(artist);

    return await db
      .deleteFrom("user_favorite")
      .where("user", "=", user as UserId)
      .where("artist", "=", artist as ArtistId)
      .returningAll()
      .executeTakeFirst();
  } catch (error) {
    return errorResponse(handleError(error));
  }
}
