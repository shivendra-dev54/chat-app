import Elysia from "elysia";
import { login_controller } from "../controllers/login.controller";
import { register_controller } from "../controllers/register.controller";
import { refresh_controller } from "../controllers/refresh.controller";
import { logout_controller } from "../controllers/logout.controller";

export const auth_router = new Elysia({prefix: "/auth"});

auth_router.post("/login", login_controller);

auth_router.post("/register", register_controller);

auth_router.patch("/refresh", refresh_controller);

auth_router.delete("/logout", logout_controller);

