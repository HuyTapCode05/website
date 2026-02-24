import type { Category } from "./Category";

export type NewCategory = Omit<Category, "id">;
