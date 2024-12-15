import { Context } from "hono";
import { deleteBranchService, getBranchByIdService, getBranchService, insertBranchService, updateBranchService } from "./location.service";

//list of branches
export const listAllBranches = async (c: Context) => {
    try {
        const branches = await getBranchService();
        if (branches === null) return c.text("No branch found");
        return c.json(branches, 200);
    } catch (error: any) {
        return c.text("Error while fetching branches");
    }
}

//get payment by id
export const getBranchById = async (c: Context) => {
    const branch_id = parseInt(c.req.param("branch_id"));
    try {
        if (isNaN(branch_id)) return c.text("Invalid ID", 400);
        //search for payment    
        const branch = await getBranchByIdService(branch_id);   
        if (branch === undefined) return c.text("Branch not found", 404);
        return c.json(branch, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//insert payment
export const insertBranch = async (c: Context) => {
    try {
        const branch = await c.req.json();
        const createdBranch = await insertBranchService(branch);
        if (createdBranch === undefined) return c.text("Branch not created 😒 ", 400);
            return c.json(createdBranch, 201);        
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//update payment
export const updateBranch = async (c: Context) => {
    // return c.text("Not implemented yet", 501);
    const branch_id = Number(c.req.param("branch_id"));
    const branch = await c.req.json();
    try {
        if (isNaN(branch_id)) return c.text("Invalid ID", 400);
        //search for payment
        const existingBranch = await getBranchByIdService(branch_id);
        if (existingBranch === undefined) return c.text("Branch not found 😒", 404);
        //update payment
        const updatedBranch = await updateBranchService(branch_id, branch);
        return c.json({ msg: updatedBranch }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

//delete vehicle
export const deleteBranch = async (c: Context) => {
    const branch_id = parseInt(c.req.param("branch_id"));
    try {
        if (isNaN(branch_id)) return c.text("Invalid ID", 400);
        //search for Branch
        const existingPayment = await getBranchByIdService(branch_id);
        if (existingPayment === undefined) return c.text("Branch not found", 404);
        //delete Branch
        const deletedPayment = await deleteBranchService(branch_id);
        return c.json({ msg: deletedPayment }, 200);
    } catch (error: any) {
        return c.text(error?.message, 400);
    }
}

