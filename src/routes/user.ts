import { Hono } from "hono"

export const user = new Hono()

user.get("/", (c) => c.text("User route"))