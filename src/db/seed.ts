import { faker } from "@faker-js/faker";
import { db } from ".";
import { Category, NewCategory } from "./schema/public/Category";
import { NewUser, UserId } from "./schema/public/User";
import { NewArtist } from "./schema/public/Artist";
import { NewArtistLink } from "./schema/public/ArtistLink";
import { NewArtistEvent } from "./schema/public/ArtistEvent";
import { NewGalleryImage } from "./schema/public/GalleryImage";
import { NewArtistValidation } from "./schema/public/ArtistValidation";
import { NewArtistCategory } from "./schema/public/ArtistCategory";
import { NewArtistTag } from "./schema/public/ArtistTag";
import { NewUserFavorite } from "./schema/public/UserFavorite";
import Role from "./schema/public/Role";
faker.seed(123);

const categoryNames: string[] = [];
const userAvatarPaths: string[] = [];
const artistAvatarPaths: string[] = [];
const galleryPaths: string[] = [];

const categories: NewCategory[] = [];
const users: NewUser[] = [];
const artists: NewArtist[] = [];
const links: NewArtistLink[] = [];
const events: NewArtistEvent[] = [];
const galleryImages: NewGalleryImage[] = [];
const validations: NewArtistValidation[] = [];
const artistCategories: NewArtistCategory[] = [];
const artistTags: NewArtistTag[] = [];
const userFavorites: NewUserFavorite[] = [];

function getRandomElement(array: any[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export async function generateCategories() {
  console.log("Creating categories...");
  categoryNames.forEach((c) => {
    const category: NewCategory = {
      name: c,
    };
    categories.push(category);
  });

  await db.insertInto("category").values(categories).execute();
}

export async function generateUsers(iterations: number) {
  console.log("Creating admin...");
  await db
    .insertInto("user")
    .values({
      first_name: "Michael",
      last_name: "Stowe",
      email: "me@mkstowe.com",
      role: Role.admin,
      avatar_path: "demo.jpg",
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
    users.push(user);
  }

  await db.insertInto("user").values(users).execute();
}

export async function generateArtists(iterations: number) {
  console.log(`Generating ${iterations} artists...`);
  // artist
  // links
  // events
  // gallery
  // validate
  // category
  // tags
  //

  for (let i = 0; i < iterations; i++) {
    const artist: NewArtist = {
      user: Math.floor(Math.random() * users.length) as UserId,
      name: faker.company.name(),
      avatar_path: getRandomElement(artistAvatarPaths),
      bio: faker.company.catchPhrase(),
      slug: faker.color.human() + "-" + faker.animal.type(),
      city: faker.location.city(),
      state: faker.location.state(),
      phone: faker.phone.number(),
      email: faker.internet.email(),
      adult: faker.datatype.boolean()
    };
  }
}

export async function generateFavorites(iterations: number) {
  console.log(`Generating ${iterations} favorites...`);
}

export async function seed() {
  const numUsers = 10;
  const numArtists = 5;
  const numFavorites = 3;

  console.log("Starting seed...");
  await generateCategories();
  await generateUsers(numUsers);
  await generateArtists(numArtists);
  await generateFavorites(numFavorites);
  console.log("Done");
}

seed();
