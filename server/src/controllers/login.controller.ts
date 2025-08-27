import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcryptjs";
import { Context } from "elysia";
import * as jose from "jose";

interface ILoginProps {
    email: string;
    password: string;
}

export const login_controller = async (ctx: Context) => {
    const { email, password } = (await ctx.request.json()) as ILoginProps;

    if (!email || !password) {
        return new ApiResponse({
            status: 400,
            message: "All fields are mandatory for user to log into their account",
            data: {},
            success: false,
        }).toJSON();
    }

    const user_from_db = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (user_from_db.length === 0) {
        return new ApiResponse({
            status: 404,
            message: "User not found, register your account first.",
            data: {},
            success: false,
        }).toJSON();
    }

    const pass_from_db = user_from_db[0].password;
    const is_password_correct = await bcrypt.compare(password, pass_from_db);

    if (!is_password_correct) {
        return new ApiResponse({
            status: 400,
            message: "Invalid password",
            data: {},
            success: false,
        }).toJSON();
    }

    const access_secret = new TextEncoder().encode(process.env.ACCESS_TOKEN);
    const access_token = await new jose.SignJWT({
        id: user_from_db[0].id,
        username: user_from_db[0].username,
        email: user_from_db[0].email,
        about: user_from_db[0].about,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1h")
        .sign(access_secret);

    const refresh_secret = new TextEncoder().encode(process.env.REFRESH_TOKEN);
    const refresh_token = await new jose.SignJWT({
        id: user_from_db[0].id,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(refresh_secret);

    ctx.cookie["access_token"].set({
        value: access_token,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60, // 1h
        path: "/",
        domain: "localhost",
    });

    ctx.cookie["refresh_token"].set({
        value: refresh_token,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7d
        path: "/",
        domain: "localhost",
    });

    const updated_user = await db
        .update(users)
        .set({ refresh_token: refresh_token })
        .where(eq(users.id, user_from_db[0].id))
        .returning();

    return new ApiResponse({
        status: 200,
        message: "Logged in successfully",
        data: {
            id: updated_user[0].id,
            username: updated_user[0].username,
            email: updated_user[0].email,
            about: updated_user[0].about
        },
        success: true,
    }).toJSON();
};
