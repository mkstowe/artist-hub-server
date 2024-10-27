import { Hono } from "hono";
import { users } from "./routes/users";
import { artists } from "./routes/artists";
import { admin } from "./routes/admin";
import { cors } from "hono/cors";
import { trimTrailingSlash } from "hono/trailing-slash";

const app = new Hono();

app.use(trimTrailingSlash());
app.use("/*", cors({ origin: ["*", "http://localhost:4200"] }));

app.route("/admin", admin);
app.route("/artists", artists);
app.route("/users", users);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
