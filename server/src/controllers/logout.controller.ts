import { Context } from "elysia";
import { ApiResponse } from "../utils/ApiResponse";

export const logout_controller = async (ctx: Context) => {
    
    ctx.cookie["access_token"].set({
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    });

    ctx.cookie["refresh_token"].set({
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 0,
        path: "/",
    });

    return new ApiResponse({
        status: 200,
        message: "Logged out successfully",
        data: {
            message: "Cookies cleared",
        },
        success: true,
    }).toJSON();
};
