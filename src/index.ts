import { Hono } from "hono";
import { user } from "./routes/user";
import { artist } from "./routes/artist";

const app = new Hono();

app.route("/user", user);
app.route("/artist", artist);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
