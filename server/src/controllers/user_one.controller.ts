import { db } from "../db";
import { users } from "../db/schemas/users.schema";
import { eq } from "drizzle-orm";
import { ApiResponse } from "../utils/ApiResponse";

export const user_one_controller = async ({ params, cookie: { access_token } }: any) => {
    try {
        if(!access_token){
            return new ApiResponse({
                status: 401,
                message: "Unauthorized",
                data: [access_token],
                success: false
            }).toJSON();
        }
        
        const id: number = Number(params.id);
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, id))
            .limit(1);
    
        if (user.length === 0) {
            return new ApiResponse({
                status: 404,
                message: "user not found",
                data: null,
                success: false
            }).toJSON();
        }
    
        return new ApiResponse({
            status: 200,
            message: "successfully fetched user",
            data: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email,
                about: user[0].about
            },
            success: true
        }).toJSON();
    
    } catch (error) {
        return new ApiResponse({
            status: 500,
            message: "Error fetching user",
            data: error,
            success: false,
        }).toJSON();
    }
};