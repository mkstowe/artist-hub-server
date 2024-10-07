import { Hono } from "hono"
import { getAllArtists } from "../repos/artists-repo"

export const artists = new Hono()

artists.get("/", async (c) => {
    const artists = await getAllArtists();
    // return c.json(artists);
})