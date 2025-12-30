import { HydratedDocument } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<HydratedDocument<T>>;
  findById(id: string): Promise<HydratedDocument<T> | null>;
  findOne(filter: Partial<T>): Promise<HydratedDocument<T> | null>;
  find(filter?: Partial<T>): Promise<HydratedDocument<T>[]>;
  updateById(id: string, update: Partial<T>): Promise<HydratedDocument<T> | null>;
  deleteById(id: string): Promise<HydratedDocument<T> | null>;
}
