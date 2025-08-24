import "dotenv/config";
import { app } from "./app";

const port = process.env.PORT;

app.listen(port!);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
