import { describe, expect, it } from "bun:test";
import {
  createArtist,
  createArtistEvent,
  createArtistLink,
  createArtistTag,
  createArtistValidation,
  deleteArtist,
  deleteArtistEvent,
  deleteArtistLink,
  deleteArtistTag,
  getArtistById,
  getArtistEventById,
  getArtistEvents,
  getArtistProfile,
  getArtists,
  getArtistTagById,
  getArtistTags,
  getArtistValidationByArtist,
  getArtistValidationById,
  updateArtist,
  updateArtistEvent,
  updateArtistLink,
  updateArtistValidation,
} from "../artists-repo";
import { ArtistUpdate, NewArtist } from "../../db/schema/public/Artist";
import { DropdownOptionId } from "../../db/schema/public/DropdownOption";
import { NewUser, UserId } from "../../db/schema/public/User";
import {
  ArtistEventUpdate,
  NewArtistEvent,
} from "../../db/schema/public/ArtistEvent";
import {
  ArtistLinkUpdate,
  NewArtistLink,
} from "../../db/schema/public/ArtistLink";
import { NewArtistTag } from "../../db/schema/public/ArtistTag";
import {
  ArtistValidationUpdate,
  NewArtistValidation,
} from "../../db/schema/public/ArtistValidation";

const newUser: NewUser = {
  first_name: "John",
  last_name: "Doe",
  email: "johndoe@example.com",
};

const newArtist: NewArtist = {
  name: "Test artist",
  category: 1 as DropdownOptionId,
  user: 1 as UserId,
  slug: "test-slug",
};

describe("Artists Repo Functions", () => {
  it("getArtists should return all artists", async () => {
    const result = await getArtists();
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("email");
  });
  it("getArtistById should return one artist", async () => {
    const result = await getArtistById(1);
    expect(result).toBeDefined();
    expect(result.name).toBeDefined();
  });
  it("getArtistById should throw an error for nonexistent artist", async () => {
    await expect(getArtistById(999)).rejects.toThrow();
  });
  it("searchArtists should return artists matching query", async () => {
    // TODO: searchArtists test
  });
  it("getArtistAvatar should return artist avatar data", async () => {
    // TODO: getArtistAvatar test
  });
  it("updateArtistAvatar should update artist avatar", async () => {
    // TODO: updateArtistAvatar test
  });
  it("createArtist should create a new artist", async () => {
    const result = await createArtist(newArtist);
    expect(result).toBeDefined();
    expect(result.name).toBe(newArtist.name);
    expect(result.slug).toBe(newArtist.slug);
    expect(result.category).toBe(newArtist.category);
    expect(result.user).toBe(newArtist.user);
    await deleteArtist(result.id);
  });
  it("updateArtist should update an existing artist", async () => {
    const created = await createArtist(newArtist);
    expect(created).toBeDefined();
    const updated: ArtistUpdate = {
      name: "Updated Name",
    };
    const result = await updateArtist(created.id, updated);
    expect(result).toBeDefined();
    expect(result.name).toBe(updated.name);
    expect(result.slug).toBe(created.slug);
    await deleteArtist(result.id);
  });
  it("deleteArtist should delete an artist", async () => {
    const created = await createArtist(newArtist);
    expect(created).toBeDefined();
    const result = await deleteArtist(created.id);
    expect(result).toBeDefined();
  });
  it("getArtistProfile should return artist with associated entities", async () => {
    const created = await createArtist(newArtist);
    expect(created).toBeDefined();
    await createArtistEvent({ artist: created.id, title: "Test" });
    await createArtistLink({
      artist: created.id,
      url: "https://test.com",
      index: 1,
    });
    const result = await getArtistProfile(created.id);
    expect(result).toBeDefined();
    expect(result.id).toBe(created.id);
    expect(result.email).toBe(created.email);
    expect(result.events.length).toBeGreaterThan(0);
    expect(result.links.length).toBeGreaterThan(0);
    await deleteArtist(result.id);
  });
  it("getArtistProfile should throw error for nonexistent artist", async () => {
    await expect(getArtistProfile(999)).rejects.toThrow();
  });
  it("createArtistLink should create link for associated artist", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newLink: NewArtistLink = {
      artist: createdArtist.id,
      url: "https://test.com",
      index: 1,
    };
    const result = await createArtistLink(newLink);
    expect(result).toBeDefined();
    expect(result.artist).toBe(newLink.artist);
    expect(result.url).toBe(newLink.url);
    await deleteArtist(createdArtist.id);
  });
  it("updateArtistLink should update link for associated artist", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newLink: NewArtistLink = {
      artist: createdArtist.id,
      url: "https://test.com",
      index: 1,
    };
    const createdLink = await createArtistLink(newLink);
    expect(createdLink).toBeDefined();
    const updateLink: ArtistLinkUpdate = {
      url: "https://updated.com",
    };
    const result = await updateArtistLink(createdLink.id, updateLink);
    expect(result).toBeDefined();
    expect(result.url).toBe(updateLink.url);
    expect(result.artist).toBe(createdLink.artist);
    expect(result.index).toBe(createdLink.index);
    await deleteArtist(createdArtist.id);
  });
  it("deleteArtistLink should delete link", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newLink: NewArtistLink = {
      artist: createdArtist.id,
      url: "https://test.com",
      index: 1,
    };
    const createdLink = await createArtistLink(newLink);
    expect(createdLink).toBeDefined();
    const result = await deleteArtistLink(createdLink.id);
    expect(result).toBeDefined();
    await deleteArtist(createdArtist.id)
  });
  it("getArtistEvents should return events for associated artist", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const events = await getArtistEvents(createdArtist.id);
    expect(events).toBeDefined();
    expect(events.length).toBe(0);
    const newEvent: NewArtistEvent = {
      artist: createdArtist.id,
      title: "test",
    };
    const createdEvent = await createArtistEvent(newEvent);
    expect(createdEvent).toBeDefined();
    const result = await getArtistEvents(createdArtist.id);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].artist).toBe(newEvent.artist);
    expect(result[0].title).toBe(newEvent.title);
    await deleteArtist(createdArtist.id);
  });
  it("getArtistEventById should return one event", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newEvent: NewArtistEvent = {
      artist: createdArtist.id,
      title: "test",
    };
    const createdEvent = await createArtistEvent(newEvent);
    expect(createdEvent).toBeDefined();
    const result = await getArtistEventById(createdEvent.id);
    expect(result).toBeDefined();
    expect(result.artist).toBe(newEvent.artist);
    expect(result.title).toBe(newEvent.title);
    await deleteArtist(createdArtist.id);
  });
  it("getArtistEventById should throw error for nonexistent event", async () => {
    await expect(getArtistEventById(999)).rejects.toThrow();
  });
  it("createArtistEvent should create one event", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newEvent: NewArtistEvent = {
      artist: createdArtist.id,
      title: "test",
    };
    const result = await createArtistEvent(newEvent);
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.title).toBe(newEvent.title);
    await deleteArtist(createdArtist.id);
  });
  it("updateArtistEvent should update one event", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newEvent: NewArtistEvent = {
      artist: createdArtist.id,
      title: "test",
    };
    const createdEvent = await createArtistEvent(newEvent);
    expect(createdEvent).toBeDefined();
    const updatedEvent: ArtistEventUpdate = {
      title: "updated",
    };
    const result = await updateArtistEvent(createdEvent.id, updatedEvent);
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.title).toBe(updatedEvent.title);
    await deleteArtist(createdArtist.id);
  });
  it("deleteArtistEvent should delete one event", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newEvent: NewArtistEvent = {
      artist: createdArtist.id,
      title: "test",
    };
    const createdEvent = await createArtistEvent(newEvent);
    expect(createdEvent).toBeDefined();
    const result = await deleteArtistEvent(createdEvent.id);
    expect(result).toBeDefined();
    await deleteArtist(createdArtist.id);
  });
  it("getArtistTags should return all tags associated with artist", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const tags = await getArtistTags(createdArtist.id);
    expect(tags).toBeDefined();
    expect(tags.length).toBe(0);
    const newTag: NewArtistTag = {
      artist: createdArtist.id,
      tag: "test",
    };
    const createdTag = await createArtistTag(newTag);
    const result = await getArtistTags(createdArtist.id);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].artist).toBe(createdArtist.id);
    expect(result[0].tag).toBe(createdTag.tag);
    await deleteArtist(createdArtist.id);
  });
  it("getArtistTagById should return one tag", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const tags = await getArtistTags(createdArtist.id);
    expect(tags).toBeDefined();
    expect(tags.length).toBe(0);
    const newTag: NewArtistTag = {
      artist: createdArtist.id,
      tag: "test",
    };
    const createdTag = await createArtistTag(newTag);
    const result = await getArtistTagById(createdTag.id);
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.tag).toBe(newTag.tag);
    await deleteArtist(createdArtist.id);
  });
  it("getArtistTagById should throw error for nonexistent tag", async () => {
    await expect(getArtistTagById(999)).rejects.toThrow();
  });
  it("createArtistTag should create a tag", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const tags = await getArtistTags(createdArtist.id);
    expect(tags).toBeDefined();
    expect(tags.length).toBe(0);
    const newTag: NewArtistTag = {
      artist: createdArtist.id,
      tag: "test",
    };
    const result = await createArtistTag(newTag);
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.tag).toBe(newTag.tag);
    await deleteArtist(createdArtist.id);
  });
  it("deleteArtistTag should delete one tag", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const tags = await getArtistTags(createdArtist.id);
    expect(tags).toBeDefined();
    expect(tags.length).toBe(0);
    const newTag: NewArtistTag = {
      artist: createdArtist.id,
      tag: "test",
    };
    const createdTag = await createArtistTag(newTag);
    expect(createdTag).toBeDefined();
    const result = await deleteArtistTag(createdTag.id);
    expect(result).toBeDefined();
    await deleteArtist(createdArtist.id);
  });
  it("getArtistGallery should return all gallery images for artist", async () => {
    // TODO: getArtistGallery test
  });
  it("getArtistGalleryImage should return one gallery image", async () => {
    // TODO: getArtistGalleryImage test
  });
  it("updateArtistGalleryImage should update one image", async () => {
    // TODO: updateArtistGalleryImage test
  });
  it("deleteArtistGalleryImage should delete one image", async () => {
    // TODO: deleteArtistGalleryImage test
  });
  it("getArtistValidationByArtist should return validation associated with artist", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newValidation: NewArtistValidation = {
      artist: createdArtist.id,
      admin: 1 as UserId,
    };
    const createdValidation = await createArtistValidation(newValidation);
    expect(createdValidation).toBeDefined();
    const result = await getArtistValidationByArtist(createdArtist.id);
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.admin).toBe(newValidation.admin);
    await deleteArtist(createdArtist.id);
  });
  it("getArtistValidationByArtist should throw error for nonexistent artist", async () => {
    await expect(getArtistValidationByArtist(999)).rejects.toThrow();
  });
  it("getArtistValidationById should return one validation", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newValidation: NewArtistValidation = {
      artist: createdArtist.id,
      admin: 1 as UserId,
    };
    const createdValidation = await createArtistValidation(newValidation);
    expect(createdValidation).toBeDefined();
    const result = await getArtistValidationById(createdValidation.id);
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.admin).toBe(newValidation.admin);
    await deleteArtist(createdArtist.id);
  });
  it("getArtistValidationById should throw error for nonexistent validation", async () => {
    await expect(getArtistEventById(999)).rejects.toThrow();
  });
  it("createArtistValidation should create validation", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newValidation: NewArtistValidation = {
      artist: createdArtist.id,
      admin: 1 as UserId,
    };
    const createdValidation = await createArtistValidation(newValidation);
    expect(createdValidation).toBeDefined();
    expect(createdValidation.artist).toBe(createdArtist.id);
    expect(createdValidation.admin).toBe(newValidation.admin);
    await deleteArtist(createdArtist.id);
  });
  it("updateArtistValidation should update artist validation", async () => {
    const createdArtist = await createArtist(newArtist);
    expect(createdArtist).toBeDefined();
    const newValidation: NewArtistValidation = {
      artist: createdArtist.id,
      admin: 1 as UserId,
    };
    const createdValidation = await createArtistValidation(newValidation);
    expect(createdValidation).toBeDefined();
    const updatedValidation: ArtistValidationUpdate = {
      admin: 2 as UserId,
    };
    const result = await updateArtistValidation(
      createdArtist.id,
      updatedValidation
    );
    expect(result).toBeDefined();
    expect(result.artist).toBe(createdArtist.id);
    expect(result.admin).toBe(updatedValidation.admin);
    await deleteArtist(createdArtist.id);
  });
});
