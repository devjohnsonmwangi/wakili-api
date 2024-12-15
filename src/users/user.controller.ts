import "dotenv/config";
import { Context } from "hono";
import { 
    deleteUserService, 
    getUserByIdService, 
    getUsersService, 
    updateUserService, 
    // getUsersByRoleAndIdService,
    getUsersByRoleService ,
   
} from "./user.service";

// List all users
export const listUsers = async (c: Context) => {
    try {       
        const data = await getUsersService();
        if (!data || data.length === 0) {
            return c.json({ msg: "No Users Profile found 😒" }, 404);
        }
        // Exclude password from user profiles
        const users = data.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
        return c.json(users, 200); 
    } catch (error: any) {
        return c.json({ error: "⚠️ " + error?.message }, 400);
    }
}

// Get user by ID
export const getUserById = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("❌ Invalid ID", 400);

    try {
        const user = await getUserByIdService(user_id);
        if (!user) return c.text("🚫 User not found 😒", 404);
        const { password, ...userWithoutPassword } = user; // Exclude password
        return c.json(userWithoutPassword, 200); 
    } catch (error: any) {
        return c.json({ error: "⚠️ " + error?.message }, 400);
    }
}

// Update user
export const updateUser = async (c: Context) => {
    const user_id = parseInt(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("❌ Invalid ID", 400);

    try {
        const user = await c.req.json();
        const searchedUser = await getUserByIdService(user_id);
        if (!searchedUser) return c.json({ msg: "🚫 User not found" }, 404);

        const res = await updateUserService(user_id, user);
        if (!res) return c.json({ msg: "⚠️ User not updated" }, 404);

        return c.json({ msg: "✅ User updated successfully!" }, 201);
    } catch (error: any) {
        return c.json({ error: "⚠️ " + error?.message }, 400);
    }
}

// Delete user
export const deleteUser = async (c: Context) => {
    const user_id = Number(c.req.param("user_id"));
    if (isNaN(user_id)) return c.text("❌ Invalid ID", 400);

    try {
        const user = await getUserByIdService(user_id);
        if (!user) return c.text("🚫 User not found", 404);

        const res = await deleteUserService(user_id);
        if (!res) return c.text("⚠️ User not deleted", 404);

        return c.json({ msg: "🗑️ User deleted successfully!" }, 201);
    } catch (error: any) {
        return c.json({ error: "⚠️ " + error?.message }, 400);
    }
}


// 🕵️‍♀️ Get users by role (Only roles: lawyer, clerk, admin, manager, support)
export const getUsersByRole = async (c: Context) => {
    try {
      // 🔄 Call the service method to fetch users by role
      const users = await getUsersByRoleService();
  
      // 🚫 No users found
      if (!users || users.length === 0) {
        return c.json({ 
          msg: "😞 No users found with the specified roles. Please check back later or contact support if you believe this is an error." 
        }, 404);
      }
  
      // 🎉 Success! Return the list of users
      return c.json({ 
        msg: "✅ Users fetched successfully!", 
        users 
      }, 200);
  
    } catch (error: any) {
      // ⚠️ Log the error to the console for debugging
      console.error("Error fetching users by role:", error); // Logs the error with a custom message
  
      // 🚨 Return a friendly error message to the client
      return c.json({ 
        error: `🚨 Oops! Something went wrong: ${error?.message || 'Unknown error occurred.'}` 
      }, 500); // Use 500 for server-side errors
    }
  };
  

//   //get user by role and id function 
//   // 🕵️‍♀️ Get users by role and user_id
// export const getUsersByRoleAndId = async (c: Context) => {
//     try {
//       // Extract role and user_id from request query params or body
//       const role = c.req.query?.role;
//       const user_id = c.req.query?.user_id;
  
//       // Check if both role and user_id are provided
//       if (!role || !user_id) {
//         return c.json({
//           msg: "😞 Both 'role' and 'user_id' must be provided to fetch users."
//         }, 400); // Return bad request error if role or user_id is missing
//       }
  
//       // 🔄 Call the service method to fetch users by role and user_id
//       const users = await getUsersByRoleAndIdService(role, parseInt(user_id));
  
//       // 🚫 No users found
//       if (!users || users.length === 0) {
//         return c.json({
//           msg: "😞 No users found with the specified role and user_id. Please check back later or contact support if you believe this is an error."
//         }, 404); // Return 404 if no users are found
//       }
  
//       // 🎉 Success! Return the list of users
//       return c.json({
//         msg: "✅ Users fetched successfully!",
//         users
//       }, 200); // Return 200 with users on success
  
//     } catch (error: any) {
//       // ⚠️ Log the error to the console for debugging
//       console.error("Error fetching users by role and user_id:", error);
  
//       // 🚨 Return a friendly error message to the client
//       return c.json({
//         error: `🚨 Oops! Something went wrong: ${error?.message || 'Unknown error occurred.'}`
//       }, 500); // Return 500 for server-side errors
//     }
//   };
  