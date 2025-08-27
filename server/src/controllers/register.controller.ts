import { eq } from "drizzle-orm";
import { db } from "../db";
import { IUsers, users } from "../db/schemas/users.schema";
import { ApiResponse } from "../utils/ApiResponse";
import bcrypt from "bcryptjs";
import { Context } from "elysia";

interface IRegisterBody {
    username: string;
    email: string;
    password: string;
}

export const register_controller = async (ctx: Context) => {
    const { username, email, password } = (await ctx.request.json()) as IRegisterBody;

    if (!username || !email || !password) {
        return new ApiResponse({
            status: 400,
            message: "All fields are mandatory for registering user.",
            data: {},
            success: false,
        }).toJSON();
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_pass = await bcrypt.hash(password, salt);

    const user: IUsers = {
        username,
        email,
        password: hashed_pass,
    };

    const user_with_same_username = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);

    if (user_with_same_username.length > 0) {
        return new ApiResponse({
            status: 400,
            message: "User with same username exists.",
            data: {},
            success: false,
        }).toJSON();
    }

    const user_with_same_email = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (user_with_same_email.length > 0) {
        return new ApiResponse({
            status: 400,
            message: "User with same email exists.",
            data: {},
            success: false,
        }).toJSON();
    }

    try {
        const new_user = await db.insert(users).values(user).returning();

        return new ApiResponse({
            status: 200,
            message: "Created new user",
            data: {
                id: new_user[0].id,
                username,
                email,
                about: new_user[0].about,
                created: true,
            },
            success: true,
        }).toJSON();
    } catch (err) {
        return new ApiResponse({
            status: 500,
            message: "Unable to create user",
            data: { error: err },
            success: false,
        }).toJSON();
    }
};
