import { db } from "../index.js";
import { eq } from "drizzle-orm";
import { users } from "../schema/users.js"

export async function createUser(name: string) {
  const [result] = await db
    .insert(users)
    .values({ name: name })
    .returning();
  return result;
}

export async function getUserByName(name: string) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.name, name))
    return result
}

export async function getUsers() {
    const result = await db
        .select()
        .from(users)
    return result
}

export async function deleteUsers() {
    const result = await db
    .delete(users)
    .returning();
    return result;
}