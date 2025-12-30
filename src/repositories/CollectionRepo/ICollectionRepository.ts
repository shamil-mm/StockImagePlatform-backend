import { HydratedDocument } from "mongoose";
import { BulkWriteResult } from 'mongodb';
import { IBaseRepository } from "../Base/IBaseRepository";
import { ICollection } from "../../models/collection/collection.interface";

export interface ICollectionRepository extends IBaseRepository<ICollection> {
    bulkWrite(operations: any[]): Promise<BulkWriteResult>;
//   findByEmail(email: string): Promise<HydratedDocument<ICollection> | null>;
//   create(data: Partial<IUser>): Promise<IUser>;
//   comparePassword(user: IUser, password: string): Promise<boolean>;
  
}