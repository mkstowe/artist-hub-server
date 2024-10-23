import { describe, expect, it } from "bun:test";
import {
  createFavorite,
  createUser,
  deleteFavorite,
  deleteUser,
  getUserById,
  getUserFavorites,
  getUsers,
  updateUser,
} from "../users-repo";
import { NewUser, UserId, UserUpdate } from "../../db/schema/public/User";
import { NewArtist } from "../../db/schema/public/Artist";
import { DropdownOptionId } from "../../db/schema/public/DropdownOption";
import { createArtist, deleteArtist } from "../artists-repo";
import { NewUserFavorite } from "../../db/schema/public/UserFavorite";

describe("Users Repo Functions", () => {
  it("getUsers should return all users", async () => {
    const result = await getUsers();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].first_name).toBe("Michael");
    expect(result[0].last_name).toBe("Stowe");
  });
  it("getUserById should return one user", async () => {
    const result = await getUserById(1);
    expect(result).toBeDefined();
    expect(result.first_name).toBe("Michael");
    expect(result.last_name).toBe("Stowe");
  });
  it("getUserById should throw an error for nonexistent user", async () => {
    await expect(getUserById(999)).rejects.toThrow();
  });
  it("createUser should create a user", async () => {
    const newUser: NewUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };
    const result = await createUser(newUser);
    expect(result).toBeDefined();
    expect(result.first_name).toBe(newUser.first_name);
    expect(result.last_name).toBe(newUser.last_name);
    expect(result.email).toBe(newUser.email);
    await deleteUser(result.id);
  });
  it("updateUser should update an existing user", async () => {
    const newUser: NewUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };
    const created = await createUser(newUser);
    expect(created).toBeDefined();
    const updatedUser: UserUpdate = {
      first_name: "Updated",
    };
    const result = await updateUser(created.id, updatedUser);
    expect(result).toBeDefined();
    expect(result.first_name).toBe(updatedUser.first_name);
    expect(result.last_name).toBe(created.last_name);
    expect(result.email).toBe(created.email);
    await deleteUser(created.id);
  });
  it("deleteUser should delete an existing user", async () => {
    const newUser: NewUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };
    const created = await createUser(newUser);
    expect(created).toBeDefined();
    const result = await deleteUser(created.id);
    expect(result).toBeDefined();
  });
  it("getUserAvatar should return data for one user's avatar", async () => {
    // TODO: getUserAvatar test
  });
  it("updateUserAvatar should update one user's avatar", async () => {
    // TODO: updateUserAvatar test
  });
  it("getUserFavorites should return all favorites for a user", async () => {
    const newUser: NewUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };
    const createdUser = await createUser(newUser);
    expect(createdUser).toBeDefined();
    const newArtist: NewArtist = {
      slug: "test slug",
      user: 1 as UserId,
      category: 1 as DropdownOptionId,
      name: "Test artist",
    };
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newUserFavorite: NewUserFavorite = {
      user: createdUser.id,
      artist: createdArtist.id,
    };
    let favorites = await getUserFavorites(createdUser.id);
    expect(favorites.length).toBe(0);
    const result = await createFavorite(newUserFavorite);
    expect(result).toBeDefined();
    favorites = await getUserFavorites(createdUser.id);
    expect(favorites.length).toBe(1);
    await deleteUser(createdUser.id);
    await deleteArtist(createdArtist.id);
  });
  it("createFavorite should create a favorite artist for a user", async () => {
    const newUser: NewUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };
    const createdUser = await createUser(newUser);
    expect(createdUser).toBeDefined();
    const newArtist: NewArtist = {
      slug: "test slug",
      user: 1 as UserId,
      category: 1 as DropdownOptionId,
      name: "Test artist",
    };
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newUserFavorite: NewUserFavorite = {
      user: createdUser.id,
      artist: createdArtist.id,
    };
    let favorites = await getUserFavorites(createdUser.id);
    expect(favorites.length).toBe(0);
    const result = await createFavorite(newUserFavorite);
    expect(result).toBeDefined();
    expect(result.user).toBe(createdUser.id);
    expect(result.artist).toBe(createdArtist.id);
    favorites = await getUserFavorites(createdUser.id);
    expect(favorites.length).toBe(1);
    await deleteUser(createdUser.id);
    await deleteArtist(createdArtist.id);
  });
  it("deleteFavorite should delete a favorite artist for a user", async () => {
    const newUser: NewUser = {
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
    };
    const createdUser = await createUser(newUser);
    expect(createdUser).toBeDefined();
    const newArtist: NewArtist = {
      slug: "test slug",
      user: 1 as UserId,
      category: 1 as DropdownOptionId,
      name: "Test artist",
    };
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newUserFavorite: NewUserFavorite = {
      user: createdUser.id,
      artist: createdArtist.id,
    };
    const createdFavorite = await createFavorite(newUserFavorite);
    expect(createdFavorite).toBeDefined();
    let favorites = await getUserFavorites(createdUser.id);
    expect(favorites.length).toBe(1);
    const deleted = await deleteFavorite(createdUser.id, createdArtist.id);
    expect(deleted).toBeDefined();
    favorites = await getUserFavorites(createdUser.id);
    expect(favorites.length).toBe(0);
    await deleteUser(createdUser.id);
    await deleteArtist(createdArtist.id);
  });
});
