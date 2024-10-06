import { db } from "../db";
import { NewUser, UserUpdate } from "../db/schema/public/User";
import { getImage } from "../db/utils";

export async function getAllUsers() {
  return await db.selectFrom("user").selectAll().execute();
}

export async function getUser(id: any) {
  return await db
    .selectFrom("user")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function getUserAvatar(id: any) {
  const filepath = await db
    .selectFrom("user")
    .select("avatar_path")
    .where("id", "=", id)
    .executeTakeFirst();

  return getImage("user-avatars", filepath?.avatar_path || 'demo.jpg');
}

export async function createUser(input: NewUser) {
  return await db
    .insertInto("user")
    .values(input)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateUser(id: any, input: UserUpdate) {
  return await db
    .updateTable("user")
    .set(input)
    .where("id", "=", id)
    .returningAll()
    .execute();
}

export async function deleteUser(id: any) {
  return await db
    .deleteFrom("user")
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}
