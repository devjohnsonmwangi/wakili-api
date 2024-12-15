
import { sql } from "drizzle-orm";
import db from "../drizzle/db";
import {TUserInsert,TUserSelect, userTable  } from "../drizzle/schema";
type TRIUser = Array<{ id: number }>;
//update user_picture
export const updateUserPictureService = async (user_id: number, user_picture: string) => {
    await db.update(userTable).set({ profile_picture: user_picture }).where(sql `${userTable.user_id} = ${user_id}`);
    return "User picture updated successfully 🎉"
}

export const registerUserService = async (user: TUserInsert): Promise<TRIUser | undefined> => {
    return await db.insert(userTable).values(user).returning({id:userTable.user_id}).execute();
}

export const loginUserService = async(user:TUserSelect) => {
    const {email,password} = user;
    return await db.query.userTable.findFirst({
        columns: {
            email: true,
            role: true,
            password: true,
            user_id:true,
            full_name:true,
            phone_number:true,
        }, where : sql `${userTable.email} = ${email}`,
        
    })
}
