import { Hono } from "hono"
import { getAllArtists,  getArtistById } from "../repos/artists-repo"

export const artists = new Hono()

artists.get("/", async (c) => {
    const artists = await getAllArtists();
    return c.json(artists);
})

artists.get("/:id", async (c) => {
    const id = c.req.param("id");
    const artist = await getArtistById(id);
    
    if (!artist) {
        c.status(404);
        return c.json({ error: "Artist not found" });
    }

    return c.json(artist)
})