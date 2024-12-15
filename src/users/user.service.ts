import { eq, notInArray } from "drizzle-orm";
import db from "../drizzle/db";
import { TUserInsert, TUserSelect, userTable } from "../drizzle/schema";

// Get all users
export const getUsersService = async (): Promise<TUserSelect[] | null> => {
    return await db.query.userTable.findMany();
}

// Get user by ID
export const getUserByIdService = async (user_id: number): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.user_id, user_id)
    });
}

// Get user by email
export const getUserByEmailService = async (user_email: string): Promise<TUserSelect | undefined> => {
    return await db.query.userTable.findFirst({
        where: eq(userTable.email, user_email)
    });
}

// Update user details
export const updateUserService = async (user_id: number, user: TUserInsert) => {
    await db.update(userTable).set(user).where(eq(userTable.user_id, user_id));
    return "User updated successfully 🎉";
}

// Delete a user
export const deleteUserService = async (user_id: number) => {
    await db.delete(userTable).where(eq(userTable.user_id, user_id));
    return "User deleted successfully 🎉";
}

// Get users by role (exclude "client" and "user")




export const getUsersByRoleService = async () => {
    try {
      const users = await db.query.userTable.findMany({
        where: notInArray(userTable.role, ['client', 'user']), // Exclude "client" and "user" roles

      });
      return users;
    } catch (error) {
      console.error('Error fetching users by role:', error); // Log any errors for debugging
      throw new Error('Error fetching users by role'); // Throw the error for controller-level handling
    }
  };



  // //geting by role and id

  // export const getUsersByRoleAndIdService = async (role: string, userId: number) => {
  //   try {
  //     // Fetch users based on both role and user_id
  //     const users = await db.query.userTable.findMany({
  //       where: {
  //         [userTable.role]: role, // Filter users by the specified role
  //         [userTable.user_id]: userId, // Filter users by the specified user_id
  //       },
  //     });
  //     return users;
  //   } catch (error) {
  //     console.error('Error fetching users by role and user_id:', error); // Log any errors for debugging
  //     throw new Error('Error fetching users by role and user_id'); // Throw the error for controller-level handling
  //   }
  // };
  