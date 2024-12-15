import { eq } from "drizzle-orm";
import db from "../drizzle/db";

import { TLocationBranchInsert,TLocationBranchSelect,locationBranchTable} from "../drizzle/schema";

export const getBranchService = async ():Promise<TLocationBranchSelect[] | null>=> {
    return await db.query.locationBranchTable.findMany();    
}

export const getBranchByIdService = async (branch_id:number):Promise<TLocationBranchSelect | undefined> => {
    return await db.query.locationBranchTable.findFirst({
       where: eq(locationBranchTable.branch_id, branch_id)
    })
}

export const insertBranchService = async(branch:TLocationBranchInsert) => {
    return await db.insert(locationBranchTable).values(branch)
    .returning({branch_id:locationBranchTable.branch_id})
}

export const updateBranchService  = async(branch_id:number,branch:TLocationBranchInsert) => {
    await db.update(locationBranchTable).set(branch).where(eq(locationBranchTable.branch_id,branch_id));
    return "Branch updated successfully 🎉"
}

export const deleteBranchService = async(branch_id:number) => {
    await db.delete(locationBranchTable).where(eq(locationBranchTable.branch_id,branch_id));
    return "Branch deleted successfully 🎉"
}
