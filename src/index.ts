import { Hono } from "hono";
import { users } from "./routes/users";
import { artists } from "./routes/artists";
import { admin } from "./routes/admin";

const app = new Hono();

app.route("/users", users);
app.route("/artists", artists);
app.route("/admin", admin);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
