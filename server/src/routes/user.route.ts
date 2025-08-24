import { Elysia } from "elysia";
import { user_one_controller } from "../controllers/user_one.controller";
import { user_all_controller } from "../controllers/user_all.controller";
import { update_about_controller } from "../controllers/update_about.controller";

export const user_router = new Elysia({ prefix: "/user" })
    .get("/all", user_all_controller)
    .get("/:id", user_one_controller)
    .post("/update_about", update_about_controller);