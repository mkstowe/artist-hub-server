import { db } from "../db";

export async function getAllUsers() {
  return await db.selectFrom("user").selectAll().execute();
}

export async function getUser(id: number) {}

export async function createUser(input: any) {}

export async function updateUser(id: number, input: any) {}

export async function deleteUser(id: number) {}
