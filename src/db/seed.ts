import { faker } from "@faker-js/faker";
import { db } from ".";
import { User, NewUser, UserId } from "./schema/public/User";
import { Artist, ArtistId, NewArtist } from "./schema/public/Artist";
import { NewArtistLink } from "./schema/public/ArtistLink";
import { NewArtistEvent } from "./schema/public/ArtistEvent";
import { NewGalleryImage } from "./schema/public/GalleryImage";
import { NewArtistValidation } from "./schema/public/ArtistValidation";
import { NewArtistTag } from "./schema/public/ArtistTag";
import { NewUserFavorite } from "./schema/public/UserFavorite";
import Role from "./schema/public/Role";
import ValidationStatus from "./schema/public/ValidationStatus";
import { NewDropdownCategory } from "./schema/public/DropdownCategory";
import {
  DropdownOption,
  DropdownOptionId,
  NewDropdownOption,
} from "./schema/public/DropdownOption";

faker.seed(123456789);

const categoryNames: string[] = ["Country"];
const userAvatarPaths: string[] = [
  "demo/1.jpg",
  "demo/2.jpg",
  "demo/3.jpg",
  "demo/4.jpg",
  "demo/5.jpg",
  "demo/6.jpg",
  "demo/7.jpg",
  "demo/8.jpg",
  "demo/9.jpg",
  "demo/10.jpg",
  "demo/11.png",
  "demo/12.png",
];
const artistAvatarPaths: string[] = [
  "demo/1.jpg",
  "demo/2.jpg",
  "demo/3.jpg",
  "demo/4.jpg",
  "demo/5.jpg",
];
const galleryPaths: string[] = ["demo/1.jpg", "demo/2.jpg", "demo/3.jpg"];

const categories: NewDropdownCategory[] = [];
let users: User[] = [];
let artists: Artist[] = [];
let options: DropdownOption[] = [];
const links: NewArtistLink[] = [];
const events: NewArtistEvent[] = [];
const galleryImages: NewGalleryImage[] = [];
const validations: NewArtistValidation[] = [];
const artistTags: NewArtistTag[] = [];
const userFavorites: NewUserFavorite[] = [];

function getRandomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export async function generateCategories() {
  console.log("Creating categories...");
  categoryNames.forEach(async (c, i) => {
    const category: NewDropdownCategory = {
      label: c,
      index: i,
    };
    categories.push(category);
    const created = await db
      .insertInto("dropdown_category")
      .values(category)
      .returningAll()
      .executeTakeFirst();

    for (let j = 0; j < 5; j++) {
      const option: NewDropdownOption = {
        category: created!.id,
        value: faker.lorem.word(),
        label: faker.lorem.word(),
        index: j,
      };

      const createdOption = await db
        .insertInto("dropdown_option")
        .values(option)
        .returningAll()
        .executeTakeFirst();

      options.push(createdOption!);
    }
  });
}

export async function generateUsers(iterations: number) {
  console.log("Creating admin...");

  const newUsers: NewUser[] = [];
  await db
    .insertInto("user")
    .values({
      first_name: "Michael",
      last_name: "Stowe",
      email: "me@mkstowe.com",
      role: Role.admin,
      avatar_path: "demo/me.jpg",
    })
    .execute();

  console.log(`Generating ${iterations} users...`);
  for (let i = 0; i < iterations; i++) {
    const user: NewUser = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      avatar_path: getRandomElement(userAvatarPaths),
    };
    newUsers.push(user);
  }

  users = await db.insertInto("user").values(newUsers).returningAll().execute();
}

export async function generateArtists(iterations: number) {
  console.log(`Generating ${iterations} artists...`);

  const newArtists: NewArtist[] = [];
  for (let i = 0; i < iterations; i++) {
    const artist: NewArtist = {
      user: getRandomElement(users).id,
      name: faker.company.name(),
      avatar_path: getRandomElement(artistAvatarPaths),
      bio: faker.company.catchPhrase(),
      slug: (faker.color.human() + "-" + faker.animal.type()).replaceAll(
        " ",
        "-"
      ),
      city: faker.location.city(),
      state: faker.location.state(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      adult: Math.random() < 0.8,
      instagram: faker.internet.url(),
      website: faker.internet.url(),
      category: (Math.floor(Math.random() * options.length) +
        1) as DropdownOptionId,
      active: Math.random() < 0.8,
    };
    newArtists.push(artist);
    const newArtist: any = await db
      .insertInto("artist")
      .values(artist)
      .returningAll()
      .executeTakeFirst();

    artists.push(newArtist);

    // links
    for (let j = 0; j < 3; j++) {
      const link: NewArtistLink = {
        artist: newArtist.id as ArtistId,
        url: faker.internet.url(),
        index: j,
      };
      links.push(link);
      await db.insertInto("artist_link").values(link).execute();
    }

    // events
    for (let j = 0; j < 3; j++) {
      const startDate =
        Math.random() < 0.5 ? faker.date.soon() : faker.date.recent();

      const event: NewArtistEvent = {
        artist: newArtist.id as ArtistId,
        title: faker.word.adjective() + " " + faker.word.noun(),
        description: faker.lorem.sentence(),
        start_date: startDate,
        end_date: faker.date.soon({ refDate: startDate }),
        location: faker.location.streetAddress(),
      };
      events.push(event);
      await db.insertInto("artist_event").values(event).execute();
    }

    // gallery
    for (let j = 0; j < 3; j++) {
      const path: string = getRandomElement(galleryPaths);
      const image: NewGalleryImage = {
        artist: newArtist.id as ArtistId,
        path,
        caption: faker.lorem.sentence(),
        file_type: path.split(".")[1],
        alt_text: faker.lorem.word(),
        index: j,
      };
      galleryImages.push(image);
      await db.insertInto("gallery_image").values(image).execute();
    }

    // tags
    for (let j = 0; j < 5; j++) {
      const tag: NewArtistTag = {
        artist: newArtist.id as ArtistId,
        tag: faker.word.noun(),
      };
      artistTags.push(tag);
      await db.insertInto("artist_tag").values(tag).execute();
    }

    // validate
    const validation: NewArtistValidation = {
      artist: newArtist.id as ArtistId,
      admin: 1 as UserId,
      status:
        Math.random() < 0.8
          ? ValidationStatus.approved
          : Math.random() < 0.75
          ? ValidationStatus.pending
          : ValidationStatus.rejected,
      comments: faker.lorem.sentence(),
    };
    validations.push(validation);
    await db.insertInto("artist_validation").values(validation).execute();

    await db
      .updateTable("artist")
      .set({
        verified: validation.status === ValidationStatus.approved,
        validation_status: validation.status,
      })
      .where("id", "=", newArtist.id)
      .execute();
  }
}

export async function generateFavorites() {
  console.log(`Generating user favorites...`);

  users.forEach((u) => {
    artists.forEach((a) => {
      const favorite: NewUserFavorite = {
        user: u.id,
        artist: a.id,
      };

      if (Math.random() < 0.5) {
        userFavorites.push(favorite);
      }
    });
  });

  await db.insertInto("user_favorite").values(userFavorites).execute();
}

export async function seed() {
  const numUsers = 12;
  const numArtists = 8;

  console.log("Starting seed...");
  await generateCategories();
  await generateUsers(numUsers);
  await generateArtists(numArtists);
  await generateFavorites();
}

seed();
