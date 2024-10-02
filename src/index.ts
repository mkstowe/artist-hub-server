import { Hono } from "hono";
import { users } from "./routes/users";
import { artists } from "./routes/artists";

const app = new Hono();

app.route("/users", users);
app.route("/artists", artists);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
